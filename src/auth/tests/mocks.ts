import { HttpStatus } from '@nestjs/common';
import { mockCreateUserReturnService } from '../../models/users/tests/mocks';
import { NestResponseBuilder } from '../../core/http/nestResponseBuilder';

export const mockToken = 'ifhdgboie8.fh3847ifvoijngo32in.32847oguniodfh';

export const mockLoginReturnController = new NestResponseBuilder()
  .setStatus(HttpStatus.OK)
  .setBody(mockToken)
  .build();

export const mockReceivedConfirmationAccountMailReturnService = {
  user: mockCreateUserReturnService,
  message: 'Email has confirmed',
};

export const mockReceivedConfirmationAccountMailReturnController =
  new NestResponseBuilder()
    .setStatus(HttpStatus.OK)
    .setHeaders({
      Location: `/users/${mockReceivedConfirmationAccountMailReturnService.user.id}`,
    })
    .setBody(mockReceivedConfirmationAccountMailReturnService)
    .build();

export const mockAuthenticateInput = {
  email: 'test@test.com',
  password: '123456',
};

export const mockLoginInput = {
  id: 'f7368e17-cea9-4787-8577-ad24619532b5',
  username: 'test',
  email: 'test@test.com',
  is_active: false,
};

export const mockLoginReturn = {
  token: mockToken,
};
