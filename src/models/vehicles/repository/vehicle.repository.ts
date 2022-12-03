import { IVehicleRepository } from './i-vehicle-repository';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VehicleRepository implements IVehicleRepository {
  constructor(private prismaService: PrismaService) {}

  async create({
    owner_id,
    name,
    license_plate,
  }: CreateVehicleDto): Promise<Vehicle> {
    const newVehicle = await this.prismaService.vehicle.create({
      data: {
        name,
        license_plate,
        userId: owner_id,
      },
      include: {
        user: true,
      },
    });

    return newVehicle;
  }

  async findById(id: number): Promise<Vehicle> {
    const carFound = await this.prismaService.vehicle.findFirst({
      where: { id },
      include: {
        user: true,
      },
    });

    return carFound;
  }

  async findByLicense(license_plate: string): Promise<Vehicle> {
    const carFound = await this.prismaService.vehicle.findFirst({
      where: {
        license_plate,
      },
      include: {
        user: true,
      },
    });

    return carFound;
  }

  async findByOwner(owner_id: number): Promise<Vehicle[]> {
    const carsFound = await this.prismaService.vehicle.findMany({
      where: {
        user: {
          id: owner_id,
        },
      },
      include: {
        user: true,
      },
    });

    return carsFound;
  }

  async findAll(): Promise<Vehicle[]> {
    const vehiclesFound = await this.prismaService.vehicle.findMany({
      include: { user: true },
    });

    return vehiclesFound;
  }

  async updateById(
    id: number,
    { owner_id, license_plate, name }: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const updatedCar = await this.prismaService.vehicle.update({
      where: { id },
      data: {
        name,
        license_plate,
        userId: owner_id,
      },
      include: {
        user: true,
      },
    });

    return updatedCar;
  }

  async delete(id: number): Promise<Vehicle> {
    const deletedCar = await this.prismaService.vehicle.delete({
      where: { id },
      include: {
        user: true,
      },
    });

    return deletedCar;
  }
}
