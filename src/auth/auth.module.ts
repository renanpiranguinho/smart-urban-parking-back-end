import { JwtAuthGuard } from '../guards/jwt.guard';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from '../guards/local.guard';
import { PrismaService } from '../prisma/prisma.service';
import { LocalStrategy } from '../guards/local.strategy';
import { JwtStrategy } from '../guards/jwt.strategy';
import { EncryptData } from '../utils/encrypt-data';
import { SendMailService } from '../mail/send-mail.service';
import { BullModule } from '@nestjs/bull';
import { ActiveGuard } from '../guards/active.guard';
import { UsersRepository } from '../models/users/repository/user.repository';
import { GenerateToken } from '../providers/generate-token';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    EncryptData,
    SendMailService,
    ActiveGuard,
    UsersRepository,
    GenerateToken,
  ],
})
export class AuthModule {}
