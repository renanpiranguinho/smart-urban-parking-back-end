import { Car } from './entities/car.entity';
import { CarRepository } from './repository/car.repository';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UsersRepository } from '../users/repository/user.repository';

@Injectable()
export class CarsService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async create(
    owner_id: number,
    { name, license_plate }: CreateCarDto,
  ): Promise<Car> {
    const carExists = await this.carRepository.findByLicense(license_plate);
    if (carExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Car already exists',
      });
    }

    const ownerExists = await this.userRepository.findById(owner_id);
    if (!ownerExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Owner is not found',
      });
    }

    const regex = '[A-Z]{3}[0-9][0-9A-Z][0-9]{2}'; //Mercosul e padrão.
    const licenseHasValid = license_plate.match(regex);

    if (!licenseHasValid) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'License plate not match with requirements',
      });
    }

    const newCar = await this.carRepository.create({
      owner_id,
      name,
      license_plate,
    });

    return new Car(newCar);
  }

  async findAll() {
    const allCars = await this.carRepository.findAll();

    return allCars.map((car) => new Car(car));
  }

  async findById(id: number) {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found',
      });
    }

    return new Car(car);
  }

  async findByOwner(owner_id: number) {
    const ownerExists = await this.userRepository.findById(owner_id);
    if (!ownerExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Owner is not found',
      });
    }

    const cars = await this.carRepository.findByOwner(owner_id);
    if (!cars) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found',
      });
    }

    return cars.map((car) => new Car(car));
  }

  async findByLicense(license_plate: string) {
    const car = await this.carRepository.findByLicense(license_plate);

    if (!car) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found',
      });
    }

    return new Car(car);
  }

  async update(id: number, { owner_id, name, license_plate }: UpdateCarDto) {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found',
      });
    }

    const carPlateExists = await this.carRepository.findByLicense(
      license_plate,
    );
    if (carPlateExists && carPlateExists.id !== id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'License plate already exists',
      });
    }

    const ownerExists = await this.userRepository.findById(owner_id);
    if (!ownerExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Owner is not found',
      });
    }

    const carUpdated = await this.carRepository.updateById(id, {
      owner_id,
      name,
      license_plate,
    });

    return new Car(carUpdated);
  }

  async remove(id: number) {
    try {
      const deletedUser = await this.carRepository.delete(id);

      return new Car(deletedUser);
    } catch (error) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found',
      });
    }
  }
}
