import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

interface SendConfirmationMailDto {
  email: string;
  name: string;
  url: string;
}

@Processor('mail-queue')
export class SendMailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send-mail-job')
  async sendConfirmationMailConsumer(job: Job<SendConfirmationMailDto>) {
    const { email, name, url } = job.data;

    await this.mailerService.sendMail({
      to: email,
      from: process.env.EMAIL_LOGIN,
      subject: 'Movie Rating | Confirmação',
      template: '../mail/template/confirmation',
      context: {
        name,
        url,
      },
    });
  }
}
