import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class SetRoleDto {
  @IsEnum(Role, {
    message: 'Invalid Role name',
  })
  role: Role;
}
