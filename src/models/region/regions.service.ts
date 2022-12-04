import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-regions.dto';
import { UpdateRegionDto } from './dto/update-regions.dto';
import { Region } from './entities/regions.entity';
import { RegionsRepository } from './repository/regions.repository';

@Injectable()
export class RegionsService {
  constructor(private readonly regionsRepository: RegionsRepository) {}

  async create(createRegion: CreateRegionDto): Promise<Region> {
    const region = await this.regionsRepository.findByLatLong(
      createRegion.latitude,
      createRegion.longitude,
    );

    if (region) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Region already exists',
      });
    }

    const newRegion = await this.regionsRepository.create(createRegion);

    return newRegion;
  }

  async update(id: number, updateRegion: UpdateRegionDto): Promise<Region> {
    const region = await this.regionsRepository.findById(id);

    if (!region) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Region not found',
      });
    }

    const updatedRegion = await this.regionsRepository.update(id, updateRegion);

    return updatedRegion;
  }

  async findById(id: number): Promise<Region> {
    const region = await this.regionsRepository.findById(id);

    if (!region) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Region not found',
      });
    }

    return region;
  }

  async findByLatLong(lat: number, long: number): Promise<Region> {
    const region = await this.regionsRepository.findByLatLong(lat, long);

    if (!region) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Region not found',
      });
    }

    return region;
  }

  async findAll(): Promise<Region[]> {
    const regions = await this.regionsRepository.findAll();

    return regions;
  }

  async delete(id: number): Promise<any> {
    const region = await this.regionsRepository.findById(id);

    if (!region) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Region not found',
      });
    }

    const deletedRegion = await this.regionsRepository.delete(id);

    return deletedRegion;
  }

  async getVacancies(id: number): Promise<number> {
    const region = await this.regionsRepository.findById(id);

    if (!region) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Region not found',
      });
    }

    const now = new Date();

    const vacanciesOccupied =
      await this.regionsRepository.countVacanciesOccupied(id, now);

    return region.parking_lots - vacanciesOccupied;
  }
}
