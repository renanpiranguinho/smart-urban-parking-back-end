import { VehicleModule } from './models/vehicles/vehicles.module';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { NestResponseInterceptor } from './core/http/nestResponse.interceptor';
import { HttpExceptionFilter } from './common/filters/httpException.filter';

import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './models/users/users.module';
import { CreditCardsModule } from './models/credit-cards/credit-cards.module';
import { SendMailModule } from './mail/send-mail.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './models/payments/payments.module';
import { RegionsModule } from './models/region/regions.module';
import { TaskModule } from './notifications/task.module';

@Module({
  imports: [
    UsersModule,
    CreditCardsModule,
    AuthModule,
    PaymentsModule,
    SendMailModule,
    TaskModule,
    CreditCardsModule,
    VehicleModule,
    RegionsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: NestResponseInterceptor,
    },
  ],
})
export class AppModule {}
