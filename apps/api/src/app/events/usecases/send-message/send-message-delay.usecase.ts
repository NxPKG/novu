import { Injectable } from '@nestjs/common';
import { MessageRepository } from '@novu/dal';
import { ExecutionDetailsSourceEnum, ExecutionDetailsStatusEnum } from '@novu/shared';
import { CreateLog } from '../../../logs/usecases/create-log/create-log.usecase';
import { CreateExecutionDetails } from '../../../execution-details/usecases/create-execution-details/create-execution-details.usecase';
import {
  CreateExecutionDetailsCommand,
  DetailEnum,
} from '../../../execution-details/usecases/create-execution-details/create-execution-details.command';
import { SendMessageType } from './send-message-type.usecase';
import { SendMessageCommand } from './send-message.command';

@Injectable()
export class SendMessageDelay extends SendMessageType {
  constructor(
    protected messageRepository: MessageRepository,
    protected createLogUsecase: CreateLog,
    protected createExecutionDetails: CreateExecutionDetails
  ) {
    super(messageRepository, createLogUsecase, createExecutionDetails);
  }

  public async execute(command: SendMessageCommand) {
    await this.createExecutionDetails.execute(
      CreateExecutionDetailsCommand.create({
        ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
        detail: DetailEnum.DELAY_FINISHED,
        source: ExecutionDetailsSourceEnum.INTERNAL,
        status: ExecutionDetailsStatusEnum.SUCCESS,
        isTest: false,
        isRetry: false,
      })
    );
  }
}
