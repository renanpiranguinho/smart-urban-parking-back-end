import { CardBrands } from '../enums/card-brands.enum';

export interface CardInfo {
  card_number: string;
  securityCode: string;
  expiration_month: number;
  expiration_year: number;
  card_brand: CardBrands;
  card_holder_name: string;
  card_holder_cpf: string;
}
