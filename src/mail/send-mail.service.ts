import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { JobsEnum } from './enums/jobs.enum';
import { RedisQueueEnum } from './enums/redis-queue.enum';

interface SendConfirmationMailDto {
  email: string;
  name: string;
  url: string;
}

@Injectable()
export class SendMailService {
  constructor(
    @InjectQueue(RedisQueueEnum.MAIL_QUEUE) private mailQueue: Queue,
  ) {}

  async sendConfirmationMail(sendConfirmationMailDto: SendConfirmationMailDto) {
    await this.mailQueue.add(JobsEnum.SEND_MAIL, sendConfirmationMailDto);
  }
}
