import { UpdatePaymentInterface } from './../interfaces/update-payment.interface';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentInterface } from '../interfaces/create-payment.interface';

export interface IPaymentsRepository {
  create(createPayment: CreatePaymentInterface): Promise<any>;
  update(id: number, updatePayment: UpdatePaymentInterface): Promise<any>;
  findById(id: number): Promise<Payment>;
  findByUser(cpf: string): Promise<Payment[]>;
  findByBuyer(buyerId: number): Promise<Payment[]>;
  findAll(): Promise<Payment[]>;
  findApprovedByDate(date: Date): Promise<Payment[]>;
}
