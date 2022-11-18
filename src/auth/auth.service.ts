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
  sub: number;
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
    role,
    is_active,
  }: LoginUserDto): Promise<{ token: string }> {
    const token = await this.generateToken.generate({
      id,
      role,
      is_active,
    });

    return { token };
  }

  async sendConfirmationAccountMail({ id, username, email }) {
    const token = this.jwtService.sign(
      { sub: id },
      { secret: process.env.EMAIL_SECRET_TOKEN_KEY, expiresIn: '1h' },
    );

    await this.sendMailService.sendConfirmationMail({
      email,
      name: username,
      url: `${process.env.APPLICATION_DOMAIN}/confirm/${token}`,
    });
  }

  async receivedConfirmationAccountMail(
    token: string,
  ): Promise<{ user: User; message: string }> {
    try {
      const { sub } = await this.jwtService.verify(token, {
        secret: process.env.EMAIL_SECRET_TOKEN_KEY,
      });

      const validatedUser = await this.usersRepository.updateById(sub, {
        is_active: true,
      });

      const user = new User(validatedUser);

      return {
        user,
        message: 'Email has confirmed',
      };
    } catch (error) {
      const { sub } = this.jwtService.decode(token) as ITokenPayload;

      const user = await this.usersRepository.findById(sub);

      this.sendConfirmationAccountMail({
        id: user.id,
        email: user.email,
        username: user.name,
      });

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid confirmation',
      });
    }
  }
}
