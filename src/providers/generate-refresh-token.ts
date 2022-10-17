import { Injectable } from '@nestjs/common';
import { CreateRefreshTokenDto } from '../auth/dto/create-refresh-token.dto';
import { RefreshToken } from '../auth/entity/refresh-token.entity';
import { RefreshTokenRepository } from '../auth/repository/refresh-token-repository';

@Injectable()
export class GenerateRefreshToken {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async generate({
    user_email,
    user_id,
  }: CreateRefreshTokenDto): Promise<RefreshToken> {
    await this.refreshTokenRepository.deleteByUserId(user_id);

    const refreshToken = await this.refreshTokenRepository.create({
      user_email,
      user_id,
    });

    return refreshToken;
  }
}
