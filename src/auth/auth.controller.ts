import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { NestResponseBuilder } from '../core/http/nestResponseBuilder';
import { NestResponse } from '../core/http/nestResponse';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local.guard';
import { ApiTags } from '@nestjs/swagger';
import { ActiveGuard } from '../guards/active.guard';
import { Role } from 'src/models/users/enums/role.enum';

export interface IUserRequestData {
  user: {
    id: number;
    cpf: string;
    email: string;
    role: Role;
    is_active: boolean;
  };
}

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ActiveGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() { user }: IUserRequestData): Promise<NestResponse> {
    const tokens = await this.authService.login(user);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(tokens)
      .build();

    return response;
  }

  @Get('confirm/:token')
  async receivedConfirmationAccountMail(
    @Param('token') token: string,
  ): Promise<NestResponse> {
    const activeUserResponse =
      await this.authService.receivedConfirmationAccountMail(token);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setHeaders({ Location: `/users/${activeUserResponse.user.id}` })
      .setBody(activeUserResponse)
      .build();

    return response;
  }
}
