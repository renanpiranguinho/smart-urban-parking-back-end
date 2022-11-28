import { CardInfo } from '../interfaces/create-card-info.interface';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentItem } from 'mercadopago/models/payment/create-payload.model';
import { SimpleAddress } from 'mercadopago/shared/address';
import { Phone } from 'mercadopago/shared/phone';
import { Status } from '@prisma/client';
import { PaymentMethods } from '../enums/payment-method.enum';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'cpf is required' })
  @IsString({ message: 'cpf must be a string' })
  cpf: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsString({ message: 'email must be a string' })
  email: string;

  @IsNotEmpty({ message: 'region is required' })
  @IsNumber({}, { message: 'region must be a number' })
  region: number;

  @IsOptional()
  @IsString({ message: 'license_plate must be a string' })
  license_plate?: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'Vehicle must be anumber',
    },
  )
  vehicle_id?: number;

  @IsNotEmpty({ message: 'credits is required' })
  @IsNumber({}, { message: 'credits must be a number' })
  credits: number;

  description?: string;

  @IsNotEmpty({ message: 'method is required' })
  @IsEnum(PaymentMethods, { message: 'method must be a valid payment method' })
  method: PaymentMethods;

  status?: Status; //  Obrigatorio caso seja comprado por um fiscal
  valid_until?: Date;

  // Compra por fiscal
  buyer_id?: number; //  Obrigatorio caso seja comprado por um fiscal

  // Cartão de crédito
  card_info?: CardInfo; //  Obrigatório (caso o método de pagamento seja cartão de crédito)
  installments?: number; //  Obrigatório (caso o método de pagamento seja cartão de crédito)
  user_phone?: Phone; //  Opicional (caso o método de pagamento seja cartão de crédito)
  user_address?: SimpleAddress; //  Opicional (caso o método de pagamento seja cartão de crédito)

  // Para visualização do que foi comprado (mercado pago)
  items?: PaymentItem[]; //  Opicional
}
