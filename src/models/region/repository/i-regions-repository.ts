import { CreateRegionDto } from '../dto/create-regions.dto';
import { UpdateRegionDto } from '../dto/update-regions.dto';
import { Region } from '../entities/regions.entity';

export interface IRegionsRepository {
  create(createRegion: CreateRegionDto): Promise<any>;
  update(id: number, updateRegion: UpdateRegionDto): Promise<any>;
  findById(id: number): Promise<Region>;
  findByLatLong(lat: number, long: number): Promise<Region>;
  findAll(): Promise<Region[]>;
  delete(id: number): Promise<any>;
}
