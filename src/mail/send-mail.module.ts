import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SendMailConsumer } from './send-mail-consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis_container',
        port: 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_LOGIN,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"Teste de Email" <${process.env.EMAIL_LOGIN}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [SendMailService, SendMailConsumer],
  exports: [SendMailService, SendMailConsumer, BullModule],
})
export class SendMailModule {}
