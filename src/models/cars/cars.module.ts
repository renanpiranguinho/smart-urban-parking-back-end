import { UsersRepository } from 'src/models/users/repository/user.repository';
import { PrismaService } from './../../prisma/prisma.service';
import { CarRepository } from './repository/car.repository';
import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';

@Module({
  controllers: [CarsController],
  providers: [CarsService, PrismaService, CarRepository, UsersRepository],
})
export class CarsModule {}
