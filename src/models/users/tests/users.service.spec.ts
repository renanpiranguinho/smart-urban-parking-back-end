import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptData } from '../../../utils/encrypt-data';
import { AuthService } from '../../../auth/auth.service';
import { UsersService } from '../users.service';
import {
  mockCreateUserInput,
  mockCreateUserReturnService,
  mockRemoveUserReturnService,
  mockUpdateUserInput,
  mockUpdateUserReturnService,
} from './mocks';
import { UsersRepository } from '../repository/user.repository';

describe('UsersService', () => {
  let usersService: UsersService;
  let authService: AuthService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn().mockReturnValue(mockCreateUserReturnService),
            findByEmail: jest.fn().mockReturnValue(mockCreateUserReturnService),
            findAll: jest.fn().mockReturnValue([mockCreateUserReturnService]),
            updateByEmail: jest
              .fn()
              .mockReturnValue(mockUpdateUserReturnService),
            findById: jest.fn().mockReturnValue(mockCreateUserReturnService),
            updateById: jest.fn().mockReturnValue(mockUpdateUserReturnService),
            softDelete: jest.fn().mockReturnValue(mockRemoveUserReturnService),
          },
        },
        {
          provide: AuthService,
          useValue: {
            sendConfirmationAccountMail: jest.fn(),
          },
        },
        {
          provide: EncryptData,
          useValue: {
            encrypt: jest
              .fn()
              .mockReturnValue(mockCreateUserReturnService.password),
            decrypt: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(authService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('Create User', () => {
    it('should be create user return successfully value', async () => {
      jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValueOnce(undefined);

      const response = await usersService.create(mockCreateUserInput);

      expect(response).toEqual(mockCreateUserReturnService);
      expect(authService.sendConfirmationAccountMail).toBeCalledTimes(1);
    });

    it('should be active user return successfully value', async () => {
      jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValueOnce(mockRemoveUserReturnService);

      jest
        .spyOn(usersRepository, 'updateByEmail')
        .mockResolvedValueOnce(mockCreateUserReturnService);

      const response = await usersService.create(mockCreateUserInput);

      expect(response).toEqual(mockCreateUserReturnService);
    });

    it('should be create user throw error user already exists', async () => {
      await expect(usersService.create(mockCreateUserInput)).rejects.toEqual(
        new BadRequestException('User already exists'),
      );
    });
  });

  describe('Find All Users', () => {
    it('should be find all users return successfully value', async () => {
      const response = await usersService.findAll();

      expect(response).toEqual([mockCreateUserReturnService]);
    });
  });

  describe('Find One User', () => {
    it('should be find one user return successfully value', async () => {
      const response = await usersService.findById('ugevfkhbwek');

      expect(response).toEqual(mockCreateUserReturnService);
    });

    it('should be find one user throw error not found', async () => {
      jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(undefined);

      await expect(usersService.findById('ugevfkhbwek')).rejects.toEqual(
        new NotFoundException('User not found'),
      );
    });
  });

  describe('Update User', () => {
    it('should be update user return successfully value', async () => {
      const response = await usersService.update(
        'ugevfkhbwek',
        mockUpdateUserInput,
      );

      expect(response).toEqual(mockUpdateUserReturnService);
    });

    it('should be update user throw error not found', async () => {
      jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(undefined);

      await expect(
        usersService.update('ugevfkhbwek', mockUpdateUserInput),
      ).rejects.toEqual(new NotFoundException('User not found'));
    });
  });

  describe('Delete User', () => {
    it('should be delete user return successfully value', async () => {
      jest
        .spyOn(usersRepository, 'softDelete')
        .mockResolvedValueOnce(mockRemoveUserReturnService);

      const response = await usersService.remove('ugevfkhbwek');

      expect(response).toEqual(mockRemoveUserReturnService);
    });

    it('should be delete user throw error not found', async () => {
      jest
        .spyOn(usersRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      await expect(usersService.remove('ugevfkhbwek')).rejects.toEqual(
        new NotFoundException('User not found'),
      );
    });
  });
});
