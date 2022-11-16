import { AdvancedSearchDto } from './../dto/advanced-search.dto';
import { Payment } from '../entities/payment.entity';
import { Status } from '@prisma/client';

export interface CreatePaymentDto {
  amount: number;
  created_at: Date;
  updated_at?: Date;
  status: Status;
  method: string;
  description?: string;

  purchase_by_id: number;
  purchase_to_id: number;

  payment_id: string;
  hash: string;
}

export interface UpdatePaymentDto {
  payment_id?: string;
  updated_at: Date;
  status?: Status;
}

export interface IPaymentsRepository {
  create(createPaymentDto: CreatePaymentDto): Promise<any>;
  update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<any>;
  findById(id: number): Promise<Payment>;
  findByUserId(userId: number): Promise<Payment[]>;
  findByBuyerId(buyerId: number): Promise<Payment[]>;
  findAll(): Promise<Payment[]>;
  advancedSearch(
    userId: number,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<Payment[]>;
}
