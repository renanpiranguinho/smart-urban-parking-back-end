import { Status } from '@prisma/client';

export interface CreatePaymentInterface {
  name: string;
  cpf: string;
  credits: number;
  region: number;
  amount: number;
  vehicleId: number;
  license_plate: string;
  description?: string;
  method: string;
  status: Status;
  created_at: Date;
  valid_until?: Date;

  payment_id?: number;
  hash: string;

  buyer_id?: number;
}
