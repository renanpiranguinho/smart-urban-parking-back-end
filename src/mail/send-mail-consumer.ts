import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { JobsEnum } from './enums/jobs.enum';
import { RedisQueueEnum } from './enums/redis-queue.enum';

interface SendConfirmationMailDto {
  email: string;
  name: string;
  url: string;
}

interface SendPaymentVoucherMailDto {
  email: string;
  name: string;
  license_plate: string;
  price: string;
  validity: string;
}

@Processor(RedisQueueEnum.MAIL_QUEUE)
export class SendMailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process(JobsEnum.SEND_MAIL)
  async sendConfirmationMailConsumer(job: Job<SendConfirmationMailDto>) {
    const { email, name, url } = job.data;

    await this.mailerService.sendMail({
      to: email,
      from: process.env.EMAIL_LOGIN,
      subject: 'Estacione Aqui | Confirmação',
      template: 'confirmation.hbs',
      context: {
        name,
        url,
      },
    });
  }

  @Process(JobsEnum.SEND_PAYMENT_VOUCHER)
  async sendPaymentVoucherMailConsumer(job: Job<SendPaymentVoucherMailDto>) {
    const { email, name, license_plate, price, validity } = job.data;

    await this.mailerService.sendMail({
      to: email,
      from: process.env.EMAIL_LOGIN,
      subject: 'Estacione Aqui | Comprovante',
      template: 'payment-voucher.hbs',
      context: {
        name,
        license_plate,
        price,
        validity,
      },
    });
  }
}
