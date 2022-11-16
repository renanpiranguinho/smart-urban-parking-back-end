import { Status } from '@prisma/client';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export enum PaymentMethods {
  credit_card = 'credit_card',
  pix = 'pix',
  presential = 'presential',
}

export class AdvancedSearchDto {
  id?: number;

  buyer_id?: number;

  payment_id?: string;

  status?: Status;

  method?: PaymentMethods;

  @IsNotEmpty({ message: 'Aditional info is required' })
  @IsBoolean({ message: 'Aditional info must be a boolean' })
  aditional_info: boolean;
}
