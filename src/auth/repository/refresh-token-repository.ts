import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRefreshTokenDto } from '../dto/create-refresh-token.dto';
import { RefreshToken } from '../entity/refresh-token.entity';
import { IRefreshTokenRepository } from './i-refresh-token-repository';
import dayjs from 'dayjs';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<RefreshToken> {
    const refreshTokenFound = await this.prismaService.refreshToken.findFirst({
      where: { id },
    });

    return refreshTokenFound;
  }

  async findByEmail(email: string): Promise<RefreshToken> {
    const refreshTokenFound = await this.prismaService.refreshToken.findFirst({
      where: { user_email: email },
    });

    return refreshTokenFound;
  }

  async create(
    createRefreshTokenDto: CreateRefreshTokenDto,
  ): Promise<RefreshToken> {
    const expires_in = dayjs().add(1, 'day').unix();
    console.log(expires_in);

    const newRefreshToken = await this.prismaService.refreshToken.create({
      data: {
        ...createRefreshTokenDto,
        expires_in,
      },
    });

    return newRefreshToken;
  }

  async deleteByUserId(user_id: string): Promise<void> {
    await this.prismaService.refreshToken.deleteMany({
      where: { user_id },
    });
  }

  async deleteByEmail(email: string): Promise<RefreshToken> {
    const deletedRefreshToken = await this.prismaService.refreshToken.delete({
      where: { user_id: email },
    });

    return deletedRefreshToken;
  }
}
