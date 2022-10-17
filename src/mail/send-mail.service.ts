import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

interface SendConfirmationMailDto {
  email: string;
  name: string;
  url: string;
}

@Injectable()
export class SendMailService {
  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  async sendConfirmationMail(sendConfirmationMailDto: SendConfirmationMailDto) {
    await this.mailQueue.add('send-mail-job', sendConfirmationMailDto);
  }
}
