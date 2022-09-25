import { Inject, Injectable } from '@nestjs/common';
import { Queue, Worker, QueueBaseOptions, JobsOptions, QueueScheduler } from 'bullmq';
import { SendMessage } from '../usecases/send-message/send-message.usecase';
import { SendMessageCommand } from '../usecases/send-message/send-message.command';
import { QueueNextJob } from '../usecases/queue-next-job/queue-next-job.usecase';
import { QueueNextJobCommand } from '../usecases/queue-next-job/queue-next-job.command';
import { JobEntity, JobRepository, JobStatusEnum } from '@novu/dal';
import { StepTypeEnum, DigestUnitEnum, getRedisPrefix } from '@novu/shared';

interface IJobEntityExtended extends JobEntity {
  presend?: boolean;
}

@Injectable()
export class WorkflowQueueService {
  private bullConfig: QueueBaseOptions = {
    connection: {
      db: Number(process.env.REDIS_DB_INDEX),
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      connectTimeout: 50000,
      keepAlive: 30000,
      family: 4,
      keyPrefix: getRedisPrefix(),
    },
  };
  public readonly queue: Queue;
  public readonly worker: Worker;
  @Inject()
  private sendMessage: SendMessage;
  @Inject()
  private queueNextJob: QueueNextJob;
  @Inject()
  private jobRepository: JobRepository;
  private readonly queueScheduler: QueueScheduler;

  constructor() {
    this.queue = new Queue('standard', {
      ...this.bullConfig,
      defaultJobOptions: {
        removeOnComplete: true,
      },
    });
    this.worker = new Worker(
      'standard',
      async ({ data }: { data: IJobEntityExtended }) => {
        return await this.work(data);
      },
      {
        ...this.bullConfig,
        lockDuration: 90000,
        concurrency: 100,
      }
    );
    this.worker.on('completed', async (job) => {
      await this.jobRepository.updateStatus(job.data._id, JobStatusEnum.COMPLETED);
    });
    this.worker.on('failed', async (job, e) => {
      await this.jobRepository.updateStatus(job.data._id, JobStatusEnum.FAILED);
      await this.jobRepository.setError(job.data._id, e);
    });
    this.queueScheduler = new QueueScheduler('standard', this.bullConfig);
  }

  public async work(job: IJobEntityExtended) {
    const canceled = await this.delayedEventIsCanceled(job);
    if (canceled) {
      return;
    }

    await this.jobRepository.updateStatus(job._id, JobStatusEnum.RUNNING);

    await this.sendMessage.execute(
      SendMessageCommand.create({
        identifier: job.identifier,
        payload: job.payload ? job.payload : {},
        overrides: job.overrides ? job.overrides : {},
        step: job.step,
        transactionId: job.transactionId,
        notificationId: job._notificationId,
        environmentId: job._environmentId,
        organizationId: job._organizationId,
        userId: job._userId,
        subscriberId: job._subscriberId,
        jobId: job._id,
        events: job.digest.events,
      })
    );
    if (job.presend === true) {
      return;
    }
    await this.queueNextJob.execute(
      QueueNextJobCommand.create({
        parentId: job._id,
        environmentId: job._environmentId,
        organizationId: job._organizationId,
        userId: job._userId,
      })
    );
  }

  public async addJob(data: JobEntity | undefined, presend = false) {
    if (!data) {
      return;
    }
    const options: JobsOptions = {
      removeOnComplete: true,
      removeOnFail: true,
    };

    const digestAdded = await this.addDigestJob(data, options);
    const delayAdded = await this.addDelayJob(data, options);

    if (digestAdded || delayAdded) {
      return;
    }

    await this.jobRepository.updateStatus(data._id, JobStatusEnum.QUEUED);
    await this.queue.add(
      data._id,
      {
        ...data,
        presend,
      },
      options
    );
  }

  public static toMilliseconds(amount: number, unit: DigestUnitEnum): number {
    let delay = 1000 * amount;
    if (unit === DigestUnitEnum.DAYS) {
      delay = 60 * 60 * 24 * delay;
    }
    if (unit === DigestUnitEnum.HOURS) {
      delay = 60 * 60 * delay;
    }
    if (unit === DigestUnitEnum.MINUTES) {
      delay = 60 * delay;
    }

    return delay;
  }

  private async addDigestJob(data: JobEntity, options: JobsOptions): Promise<boolean> {
    const isValidDigestStep = data.type === StepTypeEnum.DIGEST && data.digest.amount && data.digest.unit;
    if (!isValidDigestStep) {
      return false;
    }

    const where: Partial<JobEntity> = {
      status: JobStatusEnum.DELAYED,
      type: StepTypeEnum.DIGEST,
      _subscriberId: data._subscriberId,
      _templateId: data._templateId,
      _environmentId: data._environmentId,
    };
    const delayedDigest = await this.jobRepository.findOne(where);

    if (delayedDigest) {
      return true;
    }

    await this.jobRepository.updateStatus(data._id, JobStatusEnum.DELAYED);
    const delay = WorkflowQueueService.toMilliseconds(data.digest.amount, data.digest.unit);
    if (data.digest?.updateMode) {
      const inApps = await this.jobRepository.findInAppsForDigest(data.transactionId, data._subscriberId);
      for (const inApp of inApps) {
        await this.addJob(inApp, true);
      }
    }
    await this.queue.add(data._id, data, { delay, ...options });

    return true;
  }

  private async addDelayJob(data: JobEntity, options: JobsOptions): Promise<boolean> {
    const isValidDelayStep = data.type === StepTypeEnum.DELAY && data.step.metadata.amount && data.step.metadata.unit;
    if (!isValidDelayStep) {
      return false;
    }

    await this.jobRepository.updateStatus(data._id, JobStatusEnum.DELAYED);

    let delay: number;
    if (WorkflowQueueService.checkValidDelayOverride(data)) {
      delay = WorkflowQueueService.toMilliseconds(
        data.overrides.delay.amount as number,
        data.overrides.delay.unit as DigestUnitEnum
      );
    } else {
      delay = WorkflowQueueService.toMilliseconds(data.step.metadata.amount, data.step.metadata.unit);
    }
    await this.queue.add(data._id, data, { delay, ...options });

    return true;
  }

  private static checkValidDelayOverride(data: JobEntity): boolean {
    if (!data.overrides?.delay) {
      return false;
    }
    const values = Object.values(DigestUnitEnum);

    return (
      typeof data.overrides.delay.amount === 'number' &&
      values.includes(data.overrides.delay.unit as unknown as DigestUnitEnum)
    );
  }

  private async delayedEventIsCanceled(job: JobEntity) {
    if (job.type !== StepTypeEnum.DIGEST && job.type !== StepTypeEnum.DELAY) {
      return false;
    }
    const count = await this.jobRepository.count({
      _id: job._id,
      status: JobStatusEnum.CANCELED,
    });

    return count > 0;
  }
}
