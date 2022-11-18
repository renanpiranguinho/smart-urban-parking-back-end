import { UsersRepository } from 'src/models/users/repository/user.repository';
import { PrismaService } from './../../prisma/prisma.service';
import { CarRepository } from './repository/car.repository';
import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Module({
  controllers: [CarsController],
  providers: [
    CarsService,
    PrismaService,
    CarRepository,
    UsersRepository,
    JwtService,
  ],
})
export class CarsModule {}
