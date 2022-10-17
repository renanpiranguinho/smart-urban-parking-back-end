import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EncryptData } from '../../utils/encrypt-data';
import { PasswordPipe } from './password.pipe';
import { SendMailService } from 'src/mail/send-mail.service';
import { BullModule } from '@nestjs/bull';
import { RoleGuard } from 'src/guards/role.guard';
import { UsersRepository } from './repository/user.repository';
import { GenerateToken } from 'src/providers/generate-token';
import { GenerateRefreshToken } from 'src/providers/generate-refresh-token';
import { RefreshTokenRepository } from 'src/auth/repository/refresh-token-repository';

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
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    AuthService,
    JwtModule,
    EncryptData,
    PasswordPipe,
    RoleGuard,
    UsersRepository,
    GenerateToken,
    GenerateRefreshToken,
    RefreshTokenRepository,
  ],
})
export class UsersModule {}
