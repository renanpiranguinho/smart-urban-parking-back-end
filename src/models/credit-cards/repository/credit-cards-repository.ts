import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { CreditCard } from '../entities/credit-card.entity';
import { ICreditCardsRepository } from './i-credit-cards-repository';

@Injectable()
export class CreditCardsRepository implements ICreditCardsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({
    ownerId,
    cardName,
    flag,
    number,
    expirationMonth,
    expirationYear,
    cvc,
  }: CreateCreditCardDto): Promise<CreditCard> {
    const newCard = await this.prismaService.creditCard.create({
      data: {
        ownerId,
        cardName,
        flag,
        number,
        expirationMonth,
        expirationYear,
        cvc,
      },
    });

    return newCard;
  }

  async findByNumber(ownerId: number, number: string): Promise<CreditCard> {
    const cardFound = await this.prismaService.creditCard.findFirst({
      where: { ownerId, number, deleted_at: null },
    });
    return cardFound;
  }

  async findById(id: number): Promise<CreditCard> {
    const cardFound = await this.prismaService.creditCard.findFirst({
      where: { id, deleted_at: null },
    });
    return cardFound;
  }

  async findByUserId(userId: number): Promise<CreditCard[]> {
    const allCards = await this.prismaService.creditCard.findMany({
      where: { deleted_at: null, ownerId: userId },
    });
    return allCards;
  }

  async findAll(): Promise<CreditCard[]> {
    const allCards = await this.prismaService.creditCard.findMany({
      where: { deleted_at: null },
    });
    return allCards;
  }

  async updateById(
    id: number,
    {
      ownerId,
      cardName,
      flag,
      number,
      expirationMonth,
      expirationYear,
      cvc,
    }: UpdateCreditCardDto,
  ): Promise<CreditCard> {
    const updatedCard = await this.prismaService.creditCard.update({
      where: { id },
      data: {
        ownerId,
        cardName,
        flag,
        number,
        expirationMonth,
        expirationYear,
        cvc,
      },
    });
    return updatedCard;
  }

  async softDelete(id: number): Promise<CreditCard> {
    const deletedUser = await this.prismaService.creditCard.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
    return deletedUser;
  }
}
