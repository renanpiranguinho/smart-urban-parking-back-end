import { Status } from '@prisma/client';

export class Payment {
  id: number;
  name: string;
  cpf: string;
  credits: number;
  region: number;
  amount: number;
  license_plate: string;
  description?: string;
  method: string;
  status: Status;
  created_at: Date;
  updated_at?: Date;
  valid_until?: Date;

  payment_id?: number;
  hash: string;

  // Necessesario caso seja comprado por um fiscal
  buyer_id?: number;

  constructor(payment: Partial<Payment>) {
    Object.assign(this, payment);
  }
}
