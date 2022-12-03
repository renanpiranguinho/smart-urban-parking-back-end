import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { SetRoleDto } from '../dto/set-role-dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { IUsersRepository } from './i-users-repository';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ email, name, password, cpf }: CreateUserDto): Promise<User> {
    const newUser = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        cpf,
      },
    });
    return newUser;
  }

  async findById(id: number): Promise<User> {
    const userFound = await this.prismaService.user.findFirst({
      where: { id, deleted_at: null },
    });

    return userFound;
  }

  async findByEmail(email: string): Promise<User> {
    const userFound = await this.prismaService.user.findFirst({
      where: { email },
    });

    return userFound;
  }

  async findByCpf(cpf: string): Promise<User> {
    const userFound = await this.prismaService.user.findFirst({
      where: { cpf },
    });

    return userFound;
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.prismaService.user.findMany({
      where: { deleted_at: null },
    });

    return allUsers;
  }

  async updateById(
    id: number,
    { cpf, name, email, password, is_active }: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        cpf,
        name,
        email,
        password,
        is_active,
      },
    });

    return updatedUser;
  }

  async updateByEmail(
    email: string,
    { cpf: cpf, email: newEmail, password }: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: {
        cpf: cpf,
        email: newEmail,
        password,
      },
    });

    return updatedUser;
  }

  async softDelete(id: number): Promise<User> {
    const deletedUser = await this.prismaService.user.update({
      where: { id },
      data: { deleted_at: new Date(), is_active: false },
    });

    return deletedUser;
  }

  async setRoleById(id: number, { role }: SetRoleDto): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        role,
      },
    });

    return updatedUser;
  }
}
