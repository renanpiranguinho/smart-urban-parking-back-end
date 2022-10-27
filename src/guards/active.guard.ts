import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

interface UserRequestData {
  user: {
    id: string;
    email: string;
    username: string;
    is_active: boolean;
  };
}

@Injectable()
export class ActiveGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequestData>();
    const { is_active } = request.user;

    if (!is_active) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Account is not activated',
      });
    }

    return is_active;
  }
}
