import { JwtModule } from '@nestjs/jwt';
import { FormatData } from './../../utils/format-data';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../../prisma/prisma.service';

import { BullModule } from '@nestjs/bull';
import { PaymentsRepository } from './repository/payments.repository';
import { GenerateToken } from 'src/providers/generate-token';
import { AuthService } from 'src/auth/auth.service';
import { SendMailService } from 'src/mail/send-mail.service';
import { UsersRepository } from '../users/repository/user.repository';
import { MercadoPagoService } from './mercadopago.service';
import { UsersService } from '../users/users.service';
import { VerifyParams } from 'src/utils/verify-params';
import { EncryptData } from 'src/utils/encrypt-data';
import { VehicleRepository } from '../vehicles/repository/vehicle.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_TOKEN_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentsController,
    PrismaService,
    UsersRepository,
    VehicleRepository,
    PaymentsRepository,
    GenerateToken,
    AuthService,
    SendMailService,
    JwtModule,
    EncryptData,
    MercadoPagoService,
    UsersService,
    FormatData,
    VerifyParams,
    SendMailService,
    UsersRepository,
  ],
})
export class PaymentsModule {}
