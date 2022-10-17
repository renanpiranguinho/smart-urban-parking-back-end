import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString({
    message: 'Invalid username is format',
  })
  username?: string;

  @IsEmail(
    {},
    {
      message: 'Email invalid',
    },
  )
  email?: string;

  @IsString({
    message: 'Invalid password is format',
  })
  password?: string;

  @IsEmpty()
  deleted_at?: null | Date;

  @IsEmpty()
  is_active?: boolean;
}
