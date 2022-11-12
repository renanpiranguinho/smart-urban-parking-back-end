import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsCreditCard,
  MinLength,
  MaxLength,
} from 'class-validator';
import { CreateCreditCardDto } from './create-credit-card.dto';

export class UpdateCreditCardDto extends PartialType(CreateCreditCardDto) {
  @IsNotEmpty({
    message: 'Credit card number empty',
  })
  @IsString({
    message: 'Invalid credit card number',
  })
  @IsCreditCard({
    message: 'Invalid credit card number',
  })
  number?: string;

  @MinLength(2, {
    message: 'Credit card expiration month is invalid',
  })
  @MaxLength(2, {
    message: 'Credit card expiration month is invalid',
  })
  @IsNotEmpty({
    message: 'Credit card expiration month empty',
  })
  expirationMonth?: string;

  @MinLength(2, {
    message: 'Credit card expiration month is invalid',
  })
  @MaxLength(2, {
    message: 'Credit card expiration month is invalid',
  })
  @IsNotEmpty({
    message: 'Credit card expiration year empty',
  })
  expirationYear?: string;

  @IsInt({
    message: 'Credit card security code is not a number',
  })
  @IsNotEmpty({
    message: 'Credit card security code empty',
  })
  cvc?: number;
}
