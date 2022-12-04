import { PrismaService } from './../../../prisma/prisma.service';
import { Region } from './../entities/regions.entity';
import { UpdateRegionDto } from './../dto/update-regions.dto';
import { CreateRegionDto } from './../dto/create-regions.dto';
import { Injectable } from '@nestjs/common';
import { IRegionsRepository } from './i-regions-repository';

@Injectable()
export class RegionsRepository implements IRegionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRegion: CreateRegionDto): Promise<Region> {
    const newRegion = await this.prismaService.region.create({
      data: createRegion,
    });

    return newRegion;
  }

  async update(id: number, updateRegion: UpdateRegionDto): Promise<Region> {
    const updatedRegion = await this.prismaService.region.update({
      where: { id },
      data: updateRegion,
    });

    return updatedRegion;
  }

  async findById(id: number): Promise<Region> {
    const region = await this.prismaService.region.findUnique({
      where: { id },
    });

    return region;
  }

  async findByLatLong(lat: number, long: number): Promise<Region> {
    const region = await this.prismaService.region.findFirst({
      where: {
        latitude: lat,
        longitude: long,
      },
    });

    return region;
  }

  async findAll(): Promise<Region[]> {
    const regions = await this.prismaService.region.findMany();

    return regions;
  }

  async countVacanciesOccupied(id: number, date: Date): Promise<number> {
    const vacancies = await this.prismaService.payment.count({
      where: {
        region: id,
        status: 'approved',
        valid_until: {
          gte: date,
        },
      },
    });

    return vacancies;
  }

  async delete(id: number): Promise<any> {
    const deletedRegion = await this.prismaService.region.delete({
      where: { id },
    });

    return deletedRegion;
  }
}
