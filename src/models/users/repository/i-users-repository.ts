import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(): Promise<User[]>;
  updateById(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<User>;
  softDelete(id: number): Promise<User>;
}
