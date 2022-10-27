import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({
    message: 'Login is missing',
  })
  login: string;

  @IsNotEmpty({
    message: 'Password is missing',
  })
  @IsString({
    message: 'Field password is invalid format',
  })
  password: string;
}
