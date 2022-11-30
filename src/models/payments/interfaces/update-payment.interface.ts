import { Status } from '@prisma/client';

export interface UpdatePaymentInterface {
  name?: string;
  cpf?: string;
  license_plate?: string;
  description?: string;
  status?: Status;
  updated_at: Date;
  valid_until?: Date;
  payment_id?: number;
  notified?: boolean;
  notified_at?: Date;
  notified_fiscal?: boolean;
  notified_fiscal_at?: Date;
}
