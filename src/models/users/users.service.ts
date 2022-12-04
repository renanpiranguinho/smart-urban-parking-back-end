import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EncryptData } from '../../utils/encrypt-data';
import { AuthService } from '../../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './repository/user.repository';
import { SetRoleDto } from './dto/set-role-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly encryptData: EncryptData,
  ) {}

  async create({ cpf, name, email, password }: CreateUserDto): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      if (userAlreadyExists.deleted_at) {
        const activeUser = await this.usersRepository.updateByEmail(email, {
          cpf,
          name,
          email,
          password,
          deleted_at: null,
        });

        this.authService.sendConfirmationAccountMail({
          id: activeUser.id,
          email,
          username: name,
        });

        return new User(activeUser);
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
      });
    }

    const newUser = await this.usersRepository.create({
      cpf,
      name,
      email,
      password,
    });

    this.authService.sendConfirmationAccountMail({
      id: newUser.id,
      email,
      username: name,
    });

    return new User(newUser);
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.usersRepository.findAll();

    return allUsers.map((user) => new User(user));
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return new User(user);
  }

  async update(
    id: number,
    { name, cpf, email, password }: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const updatedUser = await this.usersRepository.updateById(id, {
      name,
      cpf,
      email,
      password: password && password,
    });

    return new User(updatedUser);
  }

  async remove(id: number): Promise<User> {
    try {
      const deletedUser = await this.usersRepository.softDelete(id);

      return new User(deletedUser);
    } catch (error) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
  }

  async setRole(id: number, { role }: SetRoleDto): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const updatedUser = await this.usersRepository.setRoleById(id, {
      role,
    });

    return new User(updatedUser);
  }
}
