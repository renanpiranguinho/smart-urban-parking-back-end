import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/models/users/repository/user.repository';

export interface IJwtPayload {
  sub: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_TOKEN_KEY,
    });
  }

  async validate({ sub }: IJwtPayload) {
    const { id, username, email, is_admin, is_active } =
      await this.usersRepository.findById(sub);

    return {
      id,
      username,
      email,
      is_admin,
      is_active,
    };
  }
}
