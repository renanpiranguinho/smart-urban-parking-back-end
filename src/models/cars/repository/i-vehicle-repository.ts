import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';

export interface IVehicleRepository {
  create(carData: CreateVehicleDto): Promise<Vehicle>;
  findById(id: number): Promise<Vehicle | null>;
  findByLicense(licensePlate: string): Promise<Vehicle>;
  findByOwner(owner_id: number): Promise<Vehicle[]>;
  findAll(): Promise<Vehicle[]>;
  updateById(id: number, carUpdateData: UpdateVehicleDto): Promise<Vehicle>;
  delete(id: number): Promise<Vehicle>;
}
