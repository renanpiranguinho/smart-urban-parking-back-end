import {
  PipeTransform,
  Injectable,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { EncryptData } from '../../utils/encrypt-data';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class PasswordPipe implements PipeTransform {
  constructor(private readonly encryptData: EncryptData) {}

  async transform({
    username,
    email,
    password,
  }: CreateUserDto | UpdateUserDto): Promise<CreateUserDto | UpdateUserDto> {
    const passwordHasValid = password.match(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[.!?$%_-])[A-Za-z\d.!?$%_-]{10,}$/g,
    );

    if (!passwordHasValid) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Password not match with requirements',
      });
    }

    const passwordHash = await this.encryptData.encrypt(password, 10);

    return {
      username,
      email,
      password: passwordHash,
    };
  }
}
