import { CreateRefreshTokenDto } from '../dto/create-refresh-token.dto';
import { RefreshToken } from '../entity/refresh-token.entity';

export interface IRefreshTokenRepository {
  findById(id: string): Promise<RefreshToken>;
  findByEmail(email: string): Promise<RefreshToken>;
  create(createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshToken>;
  deleteByUserId(user_id: string): Promise<void>;
  deleteByEmail(email: string): Promise<RefreshToken>;
}
