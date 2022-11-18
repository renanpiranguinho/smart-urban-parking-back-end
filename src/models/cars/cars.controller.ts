import { IUserRequestData } from './../../auth/auth.controller';
import { JwtAuthGuard } from './../../guards/jwt.guard';
import { NestResponseBuilder } from './../../core/http/nestResponseBuilder';
import { NestResponse } from './../../core/http/nestResponse';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from '../users/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

export interface IFindCarRequestData {
  license_plate: string;
}
@UseGuards(RolesGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() { user }: IUserRequestData,
    @Body() createCarDto: CreateCarDto,
  ): Promise<NestResponse> {
    const newCar = await this.carsService.create(user.id, createCarDto);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/cars/${newCar.id}` })
      .setBody(newCar)
      .build();

    return response;
  }

  @Roles(Role.ADMIN, Role.FISCAL)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<NestResponse> {
    const allCars = await this.carsService.findAll();
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(allCars)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mycars')
  async findMyCars(@Req() { user }: IUserRequestData): Promise<NestResponse> {
    const carFound = await this.carsService.findByOwner(user.id);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(carFound)
      .build();

    return response;
  }

  @Roles(Role.ADMIN, Role.FISCAL)
  @UseGuards(JwtAuthGuard)
  @Get('/find/:id')
  async findById(@Param('id') id: number): Promise<NestResponse> {
    const carFound = this.carsService.findById(id);
    const response = new NestResponseBuilder()
      .setBody(carFound)
      .setStatus(HttpStatus.OK)
      .build();

    return response;
  }

  @Roles(Role.ADMIN, Role.FISCAL)
  @UseGuards(JwtAuthGuard)
  @Get('/findbyplate')
  async findByLicensePlate(
    @Body() data: IFindCarRequestData,
  ): Promise<NestResponse> {
    const carFound = await this.carsService.findByLicense(data.license_plate);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(carFound)
      .build();
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<NestResponse> {
    const updatedCar = await this.carsService.update(id, updateCarDto);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setHeaders({ Location: `/cars/${updatedCar.id}` })
      .setBody(updatedCar)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<NestResponse> {
    const deletedCar = await this.carsService.remove(id);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(deletedCar)
      .build();

    return response;
  }
}
