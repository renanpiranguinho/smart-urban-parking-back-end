import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../models/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateAuthDto } from './dto/authenticate-user.dto';
import { SendMailService } from '../mail/send-mail.service';
import { EncryptData } from '../utils/encrypt-data';
import { UsersRepository } from '..//models/users/repository/user.repository';
import { GenerateToken } from '../providers/generate-token';
import { GenerateRefreshToken } from '../providers/generate-refresh-token';
import { RefreshToken } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token-repository';
import dayjs from 'dayjs';

interface ITokenPayload {
  sub: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly generateToken: GenerateToken,
    private readonly generateRefreshToken: GenerateRefreshToken,
    private readonly sendMailService: SendMailService,
    private readonly encryptDate: EncryptData,
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async authenticate({
    email,
    password,
  }: CreateAuthDto): Promise<User | false> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return false;
    }

    const passwordHasMatch = await this.encryptDate.decrypt(
      password,
      user.password,
    );

    if (!passwordHasMatch) {
      return false;
    }

    if (!user.is_active) {
      this.sendConfirmationAccountMail({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    }

    return user;
  }

  async login({
    id,
    username,
    email,
    is_admin,
    is_active,
  }: LoginUserDto): Promise<{ token: string; refreshToken: RefreshToken }> {
    const token = await this.generateToken.generate({
      id,
      username,
      email,
      is_admin,
      is_active,
    });

    const refreshToken = await this.generateRefreshToken.generate({
      user_email: email,
      user_id: id,
    });

    return { token, refreshToken };
  }

  async logout(email: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenRepository.deleteByEmail(email);

    return refreshToken;
  }

  async refresh(
    code: string,
  ): Promise<
    { token: string } | { token: string; refreshToken: RefreshToken }
  > {
    const refreshTokenFound = await this.refreshTokenRepository.findById(code);

    if (!refreshTokenFound) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Refresh toke is invalid',
      });
    }

    const { id, username, email, is_admin, is_active } =
      await this.usersRepository.findById(refreshTokenFound.user_id);

    const token = await this.generateToken.generate({
      id,
      username,
      email,
      is_admin,
      is_active,
    });

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshTokenFound.expires_in),
    );

    if (refreshTokenExpired) {
      const refreshToken = await this.generateRefreshToken.generate({
        user_email: email,
        user_id: id,
      });

      return { token, refreshToken };
    }

    return { token };
  }

  async sendConfirmationAccountMail({ id, username, email }) {
    const token = this.jwtService.sign(
      { sub: id },
      { secret: process.env.EMAIL_SECRET_TOKEN_KEY, expiresIn: '1h' },
    );

    try {
      await this.sendMailService.sendConfirmationMail({
        email,
        name: username,
        url: `${process.env.APPLICATION_DOMAIN}/confirm/${token}`,
      });
    } catch (error) {
      console.log(error);
    }
    return;
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
        username: user.username,
      });

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid confirmation',
      });
    }
  }
}
