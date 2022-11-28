import { UsersRepository } from 'src/models/users/repository/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { VehicleRepository } from './repository/vehicle.repository';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { VehiclePipe } from './vehicle.pipe';

@Module({
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    PrismaService,
    VehicleRepository,
    UsersRepository,
    JwtService,
    VehiclePipe,
  ],
})
export class VehicleModule {}
