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
    is_admin: boolean;
  };
}

@Injectable()
export class RoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequestData>();
    const { is_admin } = request.user;

    if (!is_admin) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You have invalid role',
      });
    }

    return is_admin;
  }
}
