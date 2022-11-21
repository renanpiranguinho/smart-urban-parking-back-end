import { IVehicleRepository } from './i-vehicle-repository';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserVehicles } from '.prisma/client';

export type VehicleResponse = Vehicle & {
  users: UserVehicles[];
};

@Injectable()
export class VehicleRepository implements IVehicleRepository {
  constructor(private prismaService: PrismaService) {}

  async create({
    owner_id,
    name,
    license_plate,
  }: CreateVehicleDto): Promise<Vehicle> {
    let newVehicle: Vehicle;

    if (owner_id) {
      newVehicle = await this.prismaService.vehicle.create({
        data: {
          name,
          license_plate,
          users: {
            create: [
              {
                created_at: new Date(),
                user: {
                  connect: {
                    id: owner_id,
                  },
                },
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
    } else {
      newVehicle = await this.prismaService.vehicle.create({
        data: {
          name,
          license_plate,
        },
        include: {
          users: true,
        },
      });
    }

    return newVehicle;
  }

  async findById(id: number): Promise<Vehicle> {
    const carFound = await this.prismaService.vehicle.findFirst({
      where: { id },
      include: {
        users: true,
      },
    });

    return carFound;
  }

  async findByLicense(license_plate: string): Promise<VehicleResponse> {
    const carFound = await this.prismaService.vehicle.findFirst({
      where: {
        license_plate,
        users: {
          some: {},
        },
      },
      include: {
        users: true,
      },
    });

    return carFound;
  }

  async findByOwner(owner_id: number): Promise<Vehicle[]> {
    const carsFound = await this.prismaService.vehicle.findMany({
      where: {
        users: {
          some: {
            user_id: owner_id,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return carsFound;
  }

  async findAll(): Promise<Vehicle[]> {
    const vehiclesFound = await this.prismaService.vehicle.findMany({
      include: { users: true },
    });

    return vehiclesFound;
  }

  async updateById(
    id: number,
    { owner_id, license_plate, name }: UpdateVehicleDto,
  ): Promise<Vehicle> {
    let updatedCar: Vehicle;
    if (owner_id) {
      updatedCar = await this.prismaService.vehicle.update({
        where: { id },
        data: {
          name,
          license_plate,
          users: {
            create: [
              {
                created_at: new Date(),
                user: {
                  connect: {
                    id: owner_id,
                  },
                },
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
    } else {
      updatedCar = await this.prismaService.vehicle.update({
        where: { id },
        data: {
          name,
          license_plate,
        },
        include: {
          users: true,
        },
      });
    }
    return updatedCar;
  }

  async delete(id: number): Promise<Vehicle> {
    const deletedCar = await this.prismaService.vehicle.delete({
      where: { id },
      include: {
        users: true,
      },
    });

    return deletedCar;
  }
}
