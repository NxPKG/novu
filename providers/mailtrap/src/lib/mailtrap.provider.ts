import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  IEmailOptions,
  IEmailProvider,
  ICheckIntegrationResponse,
  CheckIntegrationResponseEnum,
} from '@novu/stateless';
import { MailtrapClient, Address, Attachment } from 'mailtrap';

export class MailtrapEmailProvider implements IEmailProvider {
  id = 'mailtrap';
  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;
  private readonly mailtrapClient: MailtrapClient;

  constructor(
    private config: {
      apiKey: string;
      from: string;
    }
  ) {
    this.mailtrapClient = new MailtrapClient({
      token: config.apiKey,
    });
  }

  async checkIntegration(
    options: IEmailOptions
  ): Promise<ICheckIntegrationResponse> {
    try {
      const result = await this.sendWithMailtrap(options);

      return {
        success: result.success,
        message: 'Integrated successfully!',
        code: CheckIntegrationResponseEnum.SUCCESS,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Integration check failed.',
        code: CheckIntegrationResponseEnum.FAILED,
      };
    }
  }

  async sendMessage(
    options: IEmailOptions
  ): Promise<ISendMessageSuccessResponse> {
    const response = await this.sendWithMailtrap(options);

    return {
      id: response.message_ids[0],
      date: new Date().toISOString(),
    };
  }

  private getAttachments(
    attachments: IEmailOptions['attachments'],
    inlineAttachments: IEmailOptions['inlineAttachments']
  ): Attachment[] | null {
    const mappedAttachments = attachments?.map((attachment) => ({
      filename: attachment.name,
      content: attachment.file,
      type: attachment.mime,
    }));
    const mappedInlineAttachments = inlineAttachments?.map((attachment) => ({
      filename: attachment.name,
      content: attachment.file,
      type: attachment.mime,
      content_id: attachment.name,
    }));
    if (mappedAttachments && mappedInlineAttachments) {
      return [...mappedAttachments, ...mappedInlineAttachments];
    }

    return mappedAttachments || mappedInlineAttachments;
  }

  private sendWithMailtrap(options: IEmailOptions) {
    return this.mailtrapClient.send({
      to: options.to.map(this.mapAddress),
      from: this.mapAddress(options.from || this.config.from),
      subject: options.subject,
      text: options.text,
      html: options.html,
      bcc: options.bcc?.map(this.mapAddress),
      cc: options.cc?.map(this.mapAddress),
      attachments: this.getAttachments(
        options.attachments,
        options.inlineAttachments
      ),
    });
  }

  private mapAddress(email: string): Address {
    return { email };
  }
}
