import { Status } from '@prisma/client';

export class Payment {
  id: number;
  amount: number;
  created_at: Date;
  updated_at?: Date;
  payment_id: string;
  status: Status;
  method: string;
  description: string;
  purchase_to_id: number;
  purchase_by_id: number;
  hash: string;

  constructor(payment: Partial<Payment>) {
    Object.assign(this, payment);
  }
}
