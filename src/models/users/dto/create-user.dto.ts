import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString({
    message: 'Invalid name is format',
  })
  name?: string;

  @IsNotEmpty({
    message: 'Username is missing',
  })
  @IsString({
    message: 'Invalid cpf is format',
  })
  cpf: string;

  @IsNotEmpty({
    message: 'Email is missing',
  })
  @IsEmail(
    {},
    {
      message: 'Email invalid',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Password is missing',
  })
  @IsString({
    message: 'Invalid password is format',
  })
  password: string;
}
