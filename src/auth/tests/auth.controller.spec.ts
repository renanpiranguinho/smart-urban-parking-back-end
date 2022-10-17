import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '../../models/ratings/tests/mocks';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  mockLoginReturnController,
  mockReceivedConfirmationAccountMailReturnController,
  mockReceivedConfirmationAccountMailReturnService,
  mockToken,
} from './mocks';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue(mockToken),
            receivedConfirmationAccountMail: jest
              .fn()
              .mockReturnValue(
                mockReceivedConfirmationAccountMailReturnService,
              ),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('Login', () => {
    it('should be login user return successfully value', async () => {
      const response = await authController.login(mockUser);

      expect(response).toEqual(mockLoginReturnController);
    });

    it('should be login throw a error', async () => {
      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error());

      expect(authController.login(mockUser)).rejects.toThrowError();
    });
  });

  describe('Received Confirm Account Mail', () => {
    it('should be received confirm account mail return successfully value', async () => {
      const response = await authController.receivedConfirmationAccountMail(
        mockToken,
      );

      expect(response).toEqual(
        mockReceivedConfirmationAccountMailReturnController,
      );
    });

    it('should be received confirm account mail throw a error', async () => {
      jest
        .spyOn(authService, 'receivedConfirmationAccountMail')
        .mockRejectedValueOnce(new Error());

      expect(
        authController.receivedConfirmationAccountMail(mockToken),
      ).rejects.toThrowError();
    });
  });
});
