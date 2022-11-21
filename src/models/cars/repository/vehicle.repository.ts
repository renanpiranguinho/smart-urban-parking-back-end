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
    let newVehicle: Vehicle;
    console.log(owner_id);
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
      });
    } else {
      newVehicle = await this.prismaService.vehicle.create({
        data: {
          name,
          license_plate,
        },
      });
    }

    return newVehicle;
  }

  async findById(id: number): Promise<Vehicle> {
    const carFound = await this.prismaService.vehicle.findFirst({
      where: { id },
    });

    return carFound;
  }

  async findByLicense(license_plate: string): Promise<Vehicle> {
    const carFound = await this.prismaService.vehicle.findFirst({
      where: {
        license_plate,
        users: {
          some: {},
        },
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
    { license_plate, name }: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const updatedCar = await this.prismaService.vehicle.update({
      where: { id },
      data: {
        license_plate,
        name,
      },
    });

    return updatedCar;
  }

  async delete(id: number): Promise<Vehicle> {
    const deletedCar = await this.prismaService.vehicle.delete({
      where: { id },
    });

    return deletedCar;
  }
}
