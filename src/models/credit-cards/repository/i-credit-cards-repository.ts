import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { CreditCard } from '../entities/credit-card.entity';

export interface ICreditCardsRepository {
  create(createCreditCardDto: CreateCreditCardDto): Promise<CreditCard>;
  findByNumber(ownerId: number, number: string): Promise<CreditCard>;
  findById(id: number): Promise<CreditCard>;
  findByUserId(usedId: number): Promise<CreditCard[]>;
  findAll(): Promise<CreditCard[]>;
  updateById(
    id: number,
    updateCreditCardDto: UpdateCreditCardDto,
  ): Promise<CreditCard>;
  softDelete(id: number): Promise<CreditCard>;
}
