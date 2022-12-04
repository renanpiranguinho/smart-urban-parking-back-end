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
  //Req,
} from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-regions.dto';
import { UpdateRegionDto } from './dto/update-regions.dto';
import { NestResponse } from '../../core/http/nestResponse';
import { NestResponseBuilder } from '../../core/http/nestResponseBuilder';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRegionDto: CreateRegionDto,
  ): Promise<NestResponse> {
    const newRegion = await this.regionsService.create(createRegionDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/regions/${newRegion.id}` })
      .setBody(newRegion)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<NestResponse> {
    const allRegions = await this.regionsService.findAll();

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(allRegions)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<NestResponse> {
    const regionFound = await this.regionsService.findById(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(regionFound)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/lat/:lat/long/:long')
  async findByLatLong(
    @Param('lat') lat: number,
    @Param('long') long: number,
  ): Promise<NestResponse> {
    const regionFound = await this.regionsService.findByLatLong(lat, long);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(regionFound)
      .build();

    return response;
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRegionDto: UpdateRegionDto,
  ): Promise<NestResponse> {
    const regionUpdated = await this.regionsService.update(id, updateRegionDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(regionUpdated)
      .build();

    return response;
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<NestResponse> {
    await this.regionsService.delete(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.NO_CONTENT)
      .build();

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('vacancies/:id')
  async getVacancies(@Param('id') id: number): Promise<NestResponse> {
    const vacancies = await this.regionsService.getVacancies(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody({
        vacancies,
      })
      .build();

    return response;
  }
}
