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
export class UserPipe implements PipeTransform {
  constructor(private readonly encryptData: EncryptData) {}
  async transform({
    name,
    cpf,
    email,
    password,
  }: CreateUserDto | UpdateUserDto): Promise<CreateUserDto | UpdateUserDto> {
    const user = {
      name: name,
      cpf: cpf,
      email: email,
      password: password,
    };

    if (password) {
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
      user.password = passwordHash;
    }

    if (cpf) {
      const cpfHasValid = cpf.match(
        /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/g,
      );

      if (!cpfHasValid) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CPF not match with requirements',
        });
      }

      const cpfFormatted = cpf.replace(/[\.-]/g, '');
      user.cpf = cpfFormatted;
    }

    return user;
  }
}
