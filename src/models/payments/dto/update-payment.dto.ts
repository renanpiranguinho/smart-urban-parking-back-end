import { Status } from '@prisma/client';

export class UpdatePaymentDto {
  status?: Status;
  updated_at?: Date;
}
