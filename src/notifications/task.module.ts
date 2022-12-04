import { Module } from '@nestjs/common';
import { SendNotificationService } from './send-notification.service';
import { PaymentsService } from '../models/payments/payments.service';
//import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task.service';
import { PaymentsRepository } from '../models/payments/repository/payments.repository';
import { MercadoPagoService } from 'src/models/payments/mercadopago.service';
import { FormatData } from 'src/utils/format-data';
import { VerifyParams } from 'src/utils/verify-params';
import { PrismaService } from 'src/prisma/prisma.service';
import { VehicleRepository } from 'src/models/vehicles/repository/vehicle.repository';
import { SendMailService } from 'src/mail/send-mail.service';
import { UsersRepository } from 'src/models/users/repository/user.repository';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [],
  providers: [
    TasksService,
    SendNotificationService,
    PaymentsService,
    PaymentsRepository,
    MercadoPagoService,
    FormatData,
    VehicleRepository,
    VerifyParams,
    PrismaService,
    SendMailService,
    UsersRepository,
  ],
  exports: [TasksService, SendNotificationService, PaymentsService],
})
export class TaskModule {}
