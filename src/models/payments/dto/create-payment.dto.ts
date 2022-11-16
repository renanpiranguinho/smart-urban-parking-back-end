import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentItem } from 'mercadopago/models/payment/create-payload.model';
import { SimpleAddress } from 'mercadopago/shared/address';
import { Phone } from 'mercadopago/shared/phone';
import { Status } from '@prisma/client';

export enum PaymentMethods {
  credit_card = 'credit_card',
  bolbradesco = 'bolbradesco',
  pix = 'pix',
  presential = 'presential',
}

export enum CardBrands {
  visa = 'visa',
  elo = 'elo',
  amex = 'amex',
  hipercard = 'hipercard',
  master = 'master',
  debelo = 'debelo',
}

export interface CardInfo {
  card_number: string;
  card_holder: {
    name: string;
    identification: {
      type: string;
      number: string;
    };
  };
  securityCode: string;
  expiration_month: number;
  expiration_year: number;
  card_brand: CardBrands;
}

export class CreatePaymentDto {
  @IsNotEmpty({
    message: 'user_id is required',
  })
  @IsNumber(
    {},
    {
      message: 'user_id must be a number',
    },
  )
  user_id: number;

  @IsNotEmpty({
    message: 'method is required',
  })
  @IsString({
    message: 'method must be a string',
  })
  @IsEnum(PaymentMethods, {
    message: 'method must be a valid payment method',
  })
  method: string;

  card_info?: CardInfo;

  token?: string;

  status?: Status;

  installments?: number;

  description?: string;

  @IsNotEmpty({
    message: 'amount is required',
  })
  @IsNumber(
    {},
    {
      message: 'amount must be a number',
    },
  )
  amount: number;

  items?: PaymentItem[];

  user_phone?: Phone;

  user_address?: SimpleAddress;
}
