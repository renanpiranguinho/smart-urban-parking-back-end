export class CreditCard {
  id: number;
  ownerId: number;

  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvc: number;

  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(user: Partial<CreditCard>) {
    Object.assign(this, user);
  }
}
