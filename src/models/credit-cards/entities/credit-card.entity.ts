export class CreditCard {
  id: number;
  ownerId: number;
  cardName: string;
  flag: string;
  number: string;
  expirationMonth: number;
  expirationYear: number;
  cvc: number;

  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(user: Partial<CreditCard>) {
    Object.assign(this, user);
  }
}
