import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@Injectable()
export class GenerateToken {
  constructor(private readonly jwtService: JwtService) {}

  async generate({
    id,
    username,
    email,
    is_admin,
    is_active,
  }: LoginUserDto): Promise<string> {
    try {
      const token = this.jwtService.sign(
        {
          sub: id,
          username,
          email,
          is_admin,
          is_active,
        },
        {
          expiresIn: '1d',
          secret: process.env.SECRET_TOKEN_KEY,
        },
      );

      return token;
    } catch (error) {
      console.log(error);
    }
  }
}
