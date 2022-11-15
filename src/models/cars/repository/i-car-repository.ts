import { UpdateCarDto } from '../dto/update-car.dto';
import { Car } from '../entities/car.entity';
import { CreateCarDto } from '../dto/create-car.dto';

export interface ICarRepository {
  create(carData: CreateCarDto): Promise<Car>;
  findById(id: number): Promise<Car | null>;
  findByLicense(licensePlate: string): Promise<Car>;
  findByOwner(owner_id: number): Promise<Car[]>;
  findAll(): Promise<Car[]>;
  updateById(id: number, carUpdateData: UpdateCarDto): Promise<Car>;
  updateByLicense(
    licensePlate: string,
    updateCarDto: UpdateCarDto,
  ): Promise<Car>;
  delete(id: number): Promise<Car>;
}
