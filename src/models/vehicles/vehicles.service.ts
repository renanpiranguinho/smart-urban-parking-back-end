import { Vehicle } from './entities/vehicle.entity';
import { VehicleRepository } from './repository/vehicle.repository';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UsersRepository } from '../users/repository/user.repository';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async create({
    owner_id,
    name,
    license_plate,
  }: CreateVehicleDto): Promise<Vehicle> {
    const newVehicle = await this.vehicleRepository.create({
      owner_id,
      name,
      license_plate,
    });

    return new Vehicle(newVehicle);
  }

  async findAll() {
    const allVehicles = await this.vehicleRepository.findAll();

    return allVehicles.map((vehicle) => new Vehicle(vehicle));
  }

  async findById(id: number) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Vehicle not found',
      });
    }

    return new Vehicle(vehicle);
  }

  async findByOwner(owner_id: number) {
    const ownerExists = await this.userRepository.findById(owner_id);
    if (!ownerExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Owner is not found',
      });
    }

    const vehicles = await this.vehicleRepository.findByOwner(owner_id);
    if (!vehicles) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Vehicle not found',
      });
    }

    return vehicles.map((car) => new Vehicle(car));
  }

  async findByLicense(license_plate: string) {
    const vehicle = await this.vehicleRepository.findByLicense(license_plate);

    if (!vehicle) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Vehicle not found',
      });
    }

    return new Vehicle(vehicle);
  }

  async update(
    id: number,
    { owner_id, name, license_plate }: UpdateVehicleDto,
  ) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Vehicle not found',
      });
    }

    const ownerExists = await this.userRepository.findById(owner_id);
    if (!ownerExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Owner is not found',
      });
    }

    const vehicleUpdated = await this.vehicleRepository.updateById(id, {
      owner_id,
      name,
      license_plate,
    });

    return new Vehicle(vehicleUpdated);
  }

  async remove(id: number) {
    try {
      const deletedUser = await this.vehicleRepository.delete(id);

      return new Vehicle(deletedUser);
    } catch (error) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Vehicle not found',
      });
    }
  }
}
