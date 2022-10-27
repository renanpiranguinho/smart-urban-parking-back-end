import { HttpStatus } from '@nestjs/common';
import { NestResponseBuilder } from '../../../core/http/nestResponseBuilder';

export const mockCreateUserInput = {
  username: 'test',
  email: 'test@test.com',
  password: '123456',
};

export const mockCreateUserReturnService = {
  id: 'f7368e17-cea9-4787-8577-ad24619532b5',
  username: 'test',
  email: 'test@test.com',
  password: '123456',
  avatar_url: null,
  is_active: false,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  favorite_movie: null,
};

export const mockCreateUserReturnController = new NestResponseBuilder()
  .setStatus(HttpStatus.CREATED)
  .setHeaders({ Location: `/users/${mockCreateUserReturnService.id}` })
  .setBody(mockCreateUserReturnService)
  .build();

export const mockFindOneUserReturnController = new NestResponseBuilder()
  .setStatus(HttpStatus.OK)
  .setBody(mockCreateUserReturnService)
  .build();

export const mockFindAllUserReturnController = new NestResponseBuilder()
  .setStatus(HttpStatus.OK)
  .setBody([mockCreateUserReturnService])
  .build();

export const mockUpdateUserInput = {
  username: 'test',
  email: 'test1@test.com',
};

export const mockUpdateUserReturnService = {
  ...mockCreateUserReturnService,
  ...mockUpdateUserInput,
};

export const mockUpdateUserReturnController = new NestResponseBuilder()
  .setStatus(HttpStatus.OK)
  .setHeaders({ Location: `/users/${mockUpdateUserReturnService.id}` })
  .setBody(mockUpdateUserReturnService)
  .build();

export const mockRemoveUserReturnService = {
  ...mockCreateUserReturnService,
  deleted_at: new Date(),
};

export const mockRemoveUserReturnController = new NestResponseBuilder()
  .setStatus(HttpStatus.OK)
  .setBody(mockRemoveUserReturnService)
  .build();
