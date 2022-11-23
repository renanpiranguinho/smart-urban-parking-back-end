import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreditCard } from './entities/credit-card.entity';
import { CreditCardsRepository } from './repository/credit-cards-repository';

@Injectable()
export class CreditCardsService {
  constructor(private readonly cardsRepository: CreditCardsRepository) {}

  async create({
    ownerId,
    cardName,
    number,
    expirationMonth,
    expirationYear,
    cvc,
  }: CreateCreditCardDto): Promise<CreditCard> {
    const cardAlreadyExists = await this.cardsRepository.findByNumber(
      ownerId,
      number,
    );

    if (cardAlreadyExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
      });
    }

    const flagTest = {
      visa: /^4[0-9]{12}(?:[0-9]{3})/,
      mastercard: /^5[1-5][0-9]{14}/,
      amex: /^3[47][0-9]{13}/,
      dinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}/,
    } as const;

    const flag = Object.keys(flagTest).find(
      (currentFlag) => !!number.match(flagTest[currentFlag]),
    );

    const newCreditCard = await this.cardsRepository.create({
      ownerId,
      cardName,
      flag,
      number,
      expirationMonth,
      expirationYear,
      cvc,
    });

    return new CreditCard(newCreditCard);
  }

  async findAll(): Promise<CreditCard[]> {
    const allCards = await this.cardsRepository.findAll();

    return allCards.map((card) => new CreditCard(card));
  }

  async findByNumber(ownerId: number, number: string): Promise<CreditCard> {
    const card = await this.cardsRepository.findByNumber(ownerId, number);

    if (!card) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Credit card not found',
      });
    }

    return new CreditCard(card);
  }

  async findByUserId(ownerId: number): Promise<CreditCard[]> {
    const allCards = await this.cardsRepository.findByUserId(ownerId);

    return allCards.map((card) => new CreditCard(card));
  }

  async findById(id: number): Promise<CreditCard> {
    const card = await this.cardsRepository.findById(id);

    if (!card) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Credit card not found',
      });
    }

    return new CreditCard(card);
  }

  async update(
    id: number,
    { flag, number, expirationMonth, expirationYear, cvc }: UpdateCreditCardDto,
  ): Promise<CreditCard> {
    const card = await this.cardsRepository.findById(id);

    if (!card) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Credit card not found',
      });
    }

    const updatedCard = await this.cardsRepository.updateById(id, {
      flag,
      number,
      expirationMonth,
      expirationYear,
      cvc,
    });

    return new CreditCard(updatedCard);
  }

  async remove(id: number) {
    try {
      const deletedCard = await this.cardsRepository.softDelete(id);
      return new CreditCard(deletedCard);
    } catch (error) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Credit card not found',
      });
    }
  }
}
