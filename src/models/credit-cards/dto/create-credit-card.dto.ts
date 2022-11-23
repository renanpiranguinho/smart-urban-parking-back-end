import { IsCreditCard, IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateCreditCardDto {
  @IsInt({
    message: 'Owner id not a number',
  })
  @IsNotEmpty({
    message: 'Owner id empty',
  })
  ownerId: number;

  @IsNotEmpty({
    message: 'Credit card name empty',
  })
  @IsString({
    message: 'Invalid credit card name',
  })
  cardName: string;

  // @IsNotEmpty({
  //   message: 'Credit card flag empty',
  // })
  // @IsString({
  //   message: 'Invalid credit card flag',
  // })
  flag?: string;

  @IsNotEmpty({
    message: 'Credit card number empty',
  })
  @IsString({
    message: 'Invalid credit card number',
  })
  @IsCreditCard({
    message: 'Invalid credit card number',
  })
  number: string;

  @IsInt({
    message: 'Not a number',
  })
  @IsNotEmpty({
    message: 'Credit card expiration month empty',
  })
  expirationMonth: number;

  @IsInt({
    message: 'Not a number',
  })
  @IsNotEmpty({
    message: 'Credit card expiration year empty',
  })
  expirationYear: number;

  @IsInt({
    message: 'Credit card security code is not a number',
  })
  @IsNotEmpty({
    message: 'Credit card security code empty',
  })
  cvc: number;
}
