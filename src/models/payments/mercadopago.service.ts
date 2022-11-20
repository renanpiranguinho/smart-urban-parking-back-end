import { TokenCardInfo } from './interfaces/token-card-info.interface';
import mercadopago from 'mercadopago';
import { Injectable } from '@nestjs/common';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';

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
    return await mercadopago.payment
      .create(createPaymentPayload)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        return error;
      });
  }

  async createCardToken(cardInfo: TokenCardInfo): Promise<any> {
    return await mercadopago.card_token
      .create(cardInfo)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        return error;
      });
  }

  async getPayment(id: number): Promise<any> {
    return await mercadopago.payment
      .get(id)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        return error;
      });
  }
}
