import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { RegionsRepository } from './repository/regions.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_TOKEN_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RegionsController],
  providers: [RegionsService, PrismaService, RegionsRepository, JwtModule],
})
export class RegionsModule {}
