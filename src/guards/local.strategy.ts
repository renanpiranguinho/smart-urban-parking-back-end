import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<User> {
    const user = await this.authService.authenticate({ login, password });

    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'login/password incorrect',
      });
    }

    const { id, email, name, is_active } = user;

    if (!is_active) {
      this.authService.sendConfirmationAccountMail({
        id,
        email,
        username: name,
      });

      throw new UnauthorizedException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'confirm your email first',
      });
    }

    return new User(user);
  }
}
