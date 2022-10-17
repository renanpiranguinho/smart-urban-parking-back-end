import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({
    message: 'Email is missing',
  })
  @IsEmail(
    {},
    {
      message: 'Email is invalid',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Password is missing',
  })
  @IsString({
    message: 'Field password is invalid format',
  })
  password: string;
}
