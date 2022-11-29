import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SendNotificationService } from './send-notification.service';
import { PaymentsService } from '../models/payments/payments.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly sendNotificationService: SendNotificationService,
    private readonly paymentsService: PaymentsService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  notifyUsers() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const now = new Date();

    (async () => {
      const payments = await this.paymentsService.getPaymentsForTask(date);

      if (payments.length > 0) {
        payments.forEach(async (payment) => {
          if (payment.valid_until < now && payment.notified === false) {
            const message = {
              payment_id: payment.id,
              region: payment.region,
              license_plate: payment.license_plate,
              title: 'Creditos Vencidos',
            };

            await this.sendNotificationService
              .sendNotification(process.env.CHANNEL_USERS, message)
              .catch((err) => {
                this.logger.error(err);
              });

            await this.paymentsService.update(payment.id, {
              notified: true,
              notified_at: new Date(),
              updated_at: new Date(),
            });
          }
        });
      }
    })();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  notifyFiscal() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const now = new Date();

    (async () => {
      const payments = await this.paymentsService.getPaymentsForTask(date);

      if (payments.length > 0) {
        payments.forEach(async (payment) => {
          const tolerance = new Date(payment.notified_at);
          tolerance.setMinutes(tolerance.getMinutes() + 10);

          if (
            payment.valid_until < now &&
            payment.notified === true &&
            tolerance < now &&
            payment.notified_fiscal === false
          ) {
            const message = {
              payment_id: payment.id,
              region: payment.region,
              license_plate: payment.license_plate,
              title: 'Creditos Vencidos',
            };

            await this.sendNotificationService
              .sendNotification(process.env.CHANNEL_FISCAL, message)
              .catch((err) => {
                this.logger.error(err);
              });

            await this.paymentsService.update(payment.id, {
              notified_fiscal: true,
              notified_fiscal_at: new Date(),
              updated_at: new Date(),
            });
          }
        });
      }
    })();
  }
}
