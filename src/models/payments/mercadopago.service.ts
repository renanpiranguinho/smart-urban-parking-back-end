import mercadopago from 'mercadopago';
import { Injectable } from '@nestjs/common';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { CardInfo } from './dto/create-payment.dto';

@Injectable()
export class MercadoPagoService {
  constructor() {
    mercadopago.configure({
      access_token: process.env.MP_ACESS_KEY,
    });

    mercadopago.configurations.setAccessToken(process.env.MP_ACESS_KEY);
  }

  async createPayment(
    createPaymentPayload: CreatePaymentPayload,
  ): Promise<any> {
    return await mercadopago.payment.create(createPaymentPayload);
  }

  async createCardToken(cardInfo: CardInfo): Promise<any> {
    return await mercadopago.card_token.create(cardInfo);
  }

  async getPayment(id: number): Promise<any> {
    return await mercadopago.payment.get(id);
  }
}
