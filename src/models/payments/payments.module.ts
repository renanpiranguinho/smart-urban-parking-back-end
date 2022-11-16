import { FormatData } from './../../utils/format-data';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EncryptData } from '../../utils/encrypt-data';
import { BullModule } from '@nestjs/bull';
import { PaymentsRepository } from './repository/payments.repository';
import { GenerateToken } from 'src/providers/generate-token';
import { AuthService } from 'src/auth/auth.service';
import { SendMailService } from 'src/mail/send-mail.service';
import { UsersRepository } from '../users/repository/user.repository';
import { MercadoPagoService } from './mercadopago.service';
import { UsersService } from '../users/users.service';
import { VerifyParams } from 'src/utils/verify-params';

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
    EncryptData,
    UsersRepository,
    PaymentsRepository,
    GenerateToken,
    AuthService,
    SendMailService,
    MercadoPagoService,
    UsersService,
    FormatData,
    VerifyParams,
  ],
})
export class PaymentsModule {}
