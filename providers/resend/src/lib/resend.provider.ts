import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ICheckIntegrationResponse,
  CheckIntegrationResponseEnum,
  IEmailOptions,
  IEmailProvider,
} from '@novu/stateless';
import { Resend } from 'resend';

export class ResendEmailProvider implements IEmailProvider {
  id = 'resend';
  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;
  private resendClient: Resend;

  constructor(
    private config: {
      apiKey: string;
      from: string;
      senderName?: string;
    }
  ) {
    this.resendClient = new Resend(this.config.apiKey);
  }

  private getAttachments(
    attachments: IEmailOptions['attachments'],
    inlineAttachments: IEmailOptions['inlineAttachments']
  ): { content?: string | Buffer; filename?: string | false | undefined }[] {
    const mappedAttachments = attachments?.map((attachment) => ({
      filename: attachment.name,
      content: attachment.file,
    }));
    const mappedInlineAttachments = inlineAttachments?.map((attachment) => ({
      filename: attachment.name,
      content: attachment.file,
      contentId: attachment.name,
      disposition: 'inline',
    }));
    if (mappedAttachments && mappedInlineAttachments) {
      return [...mappedAttachments, ...mappedInlineAttachments];
    }

    return mappedAttachments || mappedInlineAttachments;
  }

  async sendMessage(
    options: IEmailOptions
  ): Promise<ISendMessageSuccessResponse> {
    const senderName = options.senderName || this.config?.senderName;
    const fromAddress = options.from || this.config.from;

    const response = await this.resendClient.emails.send({
      from: senderName ? `${senderName} <${fromAddress}>` : fromAddress,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc,
      reply_to: options.replyTo || null,
      attachments: this.getAttachments(
        options.attachments,
        options.inlineAttachments
      ),
      bcc: options.bcc,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      id: response.data?.id,
      date: new Date().toISOString(),
    };
  }

  async checkIntegration(
    options: IEmailOptions
  ): Promise<ICheckIntegrationResponse> {
    try {
      await this.resendClient.emails.send({
        from: options.from || this.config.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        attachments: options.attachments?.map((attachment) => ({
          filename: attachment?.name,
          content: attachment.file,
        })),
        bcc: options.bcc,
      });

      return {
        success: true,
        message: 'Integrated successfully!',
        code: CheckIntegrationResponseEnum.SUCCESS,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message,
        code: CheckIntegrationResponseEnum.FAILED,
      };
    }
  }
}
