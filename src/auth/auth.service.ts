import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../models/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateAuthDto } from './dto/authenticate-user.dto';
import { SendMailService } from '../mail/send-mail.service';
import { EncryptData } from '../utils/encrypt-data';
import { UsersRepository } from '..//models/users/repository/user.repository';
import { GenerateToken } from '../providers/generate-token';

interface ITokenPayload {
  sub: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly generateToken: GenerateToken,
    private readonly sendMailService: SendMailService,
    private readonly encryptDate: EncryptData,
    private readonly usersRepository: UsersRepository,
  ) {}

  async authenticate({
    login,
    password,
  }: CreateAuthDto): Promise<User | false> {
    let user = await this.usersRepository.findByEmail(login);

    if (!user) {
      user = await this.usersRepository.findByCpf(login);
      if (!user) {
        return false;
      }
    }

    const passwordHasMatch = await this.encryptDate.decrypt(
      password,
      user.password,
    );

    if (!passwordHasMatch) {
      return false;
    }

    return user;
  }

  async login({
    id,
    cpf,
    email,
    is_active,
  }: LoginUserDto): Promise<{ token: string }> {
    const token = await this.generateToken.generate({
      id,
      cpf,
      email,
      is_active,
    });

    return { token };
  }
}
