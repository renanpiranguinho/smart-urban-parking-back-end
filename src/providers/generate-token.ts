import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@Injectable()
export class GenerateToken {
  constructor(private readonly jwtService: JwtService) {}

  async generate({ id, role, is_active }: LoginUserDto): Promise<string> {
    const token = this.jwtService.sign(
      {
        sub: id,
        role,
        is_active,
      },
      {
        expiresIn: '1d',
        secret: process.env.SECRET_TOKEN_KEY,
      },
    );

    return token;
  }
}
