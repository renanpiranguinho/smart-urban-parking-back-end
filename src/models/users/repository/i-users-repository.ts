import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(): Promise<User[]>;
  updateById(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<User>;
  softDelete(id: string): Promise<User>;
}
