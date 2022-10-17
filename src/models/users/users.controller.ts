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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NestResponse } from '../../core/http/nestResponse';
import { NestResponseBuilder } from '../../core/http/nestResponseBuilder';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PasswordPipe } from './password.pipe';
import { RoleGuard } from '../../guards/role.guard';
import { IUserRequestData } from '../../auth/auth.controller';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(PasswordPipe) createUserDto: CreateUserDto,
  ): Promise<NestResponse> {
    const newUser = await this.usersService.create(createUserDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/users/${newUser.id}` })
      .setBody(newUser)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Get()
  async findAll(): Promise<NestResponse> {
    const allUsers = await this.usersService.findAll();

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(allUsers)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMe(@Req() { user }: IUserRequestData): Promise<NestResponse> {
    const userFound = await this.usersService.findById(user.id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(userFound)
      .build();

    return response;
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NestResponse> {
    const userFound = await this.usersService.findById(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(userFound)
      .build();

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<NestResponse> {
    const updatedUser = await this.usersService.update(id, updateUserDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setHeaders({ Location: `/users/${updatedUser.id}` })
      .setBody(updatedUser)
      .build();

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<NestResponse> {
    const deletedUser = await this.usersService.remove(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(deletedUser)
      .build();

    return response;
  }
}
