import { VehiclePipe } from './vehicle.pipe';
import { IUserRequestData } from '../../auth/auth.controller';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { NestResponseBuilder } from '../../core/http/nestResponseBuilder';
import { NestResponse } from '../../core/http/nestResponse';
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
import { VehiclesService } from './vehicles.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from '../users/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

export interface IFindCarRequestData {
  license_plate: string;
}
@UseGuards(RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(VehiclePipe) createVehicleDto: CreateVehicleDto,
  ): Promise<NestResponse> {
    const newVehicle = await this.vehiclesService.create(createVehicleDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/vehicles/${newVehicle.id}` })
      .setBody(newVehicle)
      .build();

    return response;
  }

  @Roles(Role.ADMIN, Role.FISCAL)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<NestResponse> {
    const allVehicles = await this.vehiclesService.findAll();
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(allVehicles)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/myVehicles')
  async findMyVehicles(
    @Req() { user }: IUserRequestData,
  ): Promise<NestResponse> {
    const vehicleFound = await this.vehiclesService.findByOwner(user.id);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(vehicleFound)
      .build();

    return response;
  }

  @Roles(Role.ADMIN, Role.FISCAL)
  @UseGuards(JwtAuthGuard)
  @Get('/find/:id')
  async findById(@Param('id') id: number): Promise<NestResponse> {
    const vehicleFound = this.vehiclesService.findById(id);
    const response = new NestResponseBuilder()
      .setBody(vehicleFound)
      .setStatus(HttpStatus.OK)
      .build();

    return response;
  }

  @Roles(Role.ADMIN, Role.FISCAL)
  @UseGuards(JwtAuthGuard)
  @Get('/findbyplate')
  async findByLicensePlate(
    @Body(VehiclePipe) data: IFindCarRequestData,
  ): Promise<NestResponse> {
    const vehicleFound = await this.vehiclesService.findByLicense(
      data.license_plate,
    );
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(vehicleFound)
      .build();
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(VehiclePipe) updateVehicleDto: UpdateVehicleDto,
  ): Promise<NestResponse> {
    const updatedVehicle = await this.vehiclesService.update(
      id,
      updateVehicleDto,
    );
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setHeaders({ Location: `/cars/${updatedVehicle.id}` })
      .setBody(updatedVehicle)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<NestResponse> {
    const deletedVehicle = await this.vehiclesService.remove(id);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(deletedVehicle)
      .build();

    return response;
  }
}
