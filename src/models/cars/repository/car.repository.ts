import { ICarRepository } from './i-car-repository';
import { UpdateCarDto } from './../dto/update-car.dto';
import { Car } from './../entities/car.entity';
import { CreateCarDto } from './../dto/create-car.dto';
import { PrismaService } from './../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarRepository implements ICarRepository {
  constructor(private prismaService: PrismaService) {}

  async create({ owner_id, name, license_plate }: CreateCarDto): Promise<Car> {
    const newCar = await this.prismaService.car.create({
      data: {
        owner_id,
        name,
        license_plate,
      },
    });

    return newCar;
  }

  async findById(id: number): Promise<Car> {
    const carFound = await this.prismaService.car.findFirst({
      where: { id },
    });

    return carFound;
  }

  async findByLicense(license_plate: string): Promise<Car> {
    const carFound = await this.prismaService.car.findUnique({
      where: { license_plate },
    });

    return carFound;
  }

  async findByOwner(owner_id: number): Promise<Car[]> {
    const carsFound = await this.prismaService.car.findMany({
      where: { owner_id },
    });

    return carsFound;
  }

  async findAll(): Promise<Car[]> {
    const carsFound = await this.prismaService.car.findMany();

    return carsFound;
  }

  async updateById(
    id: number,
    { owner_id, license_plate, name }: UpdateCarDto,
  ): Promise<Car> {
    const updatedCar = await this.prismaService.car.update({
      where: { id },
      data: {
        owner_id,
        license_plate,
        name,
      },
    });

    return updatedCar;
  }

  async updateByLicense(
    license_plate: string,
    { owner_id, license_plate: newLicense, name }: UpdateCarDto,
  ): Promise<Car> {
    const updatedCar = await this.prismaService.car.update({
      where: { license_plate },
      data: {
        owner_id,
        license_plate: newLicense,
        name,
      },
    });
    return updatedCar;
  }

  async delete(id: number): Promise<Car> {
    const deletedCar = await this.prismaService.car.delete({
      where: { id },
    });

    return deletedCar;
  }
}
