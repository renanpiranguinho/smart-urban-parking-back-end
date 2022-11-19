import { MercadoPagoService } from './../models/payments/mercadopago.service';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/models/payments/dto/create-payment.dto';

@Injectable()
export class FormatData {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  async formatPaymentPayload(
    paymentPayload: CreatePaymentDto,
    hash: string,
    token: string,
    transactionAmount: number,
    paymentId: number,
  ): Promise<CreatePaymentPayload> {
    const payment: CreatePaymentPayload = {
      payer: {
        first_name: paymentPayload.name.split(' ')[0],
        last_name: paymentPayload.name.split(' ').pop(),
        email: paymentPayload.email,
        identification: {
          type: 'CPF',
          number: paymentPayload.cpf,
        },
      },
      transaction_amount: transactionAmount,
      payment_method_id: '',
      token: token,
      installments: 1,
      description: paymentPayload.description || 'Compra de créditos',
      external_reference: hash,
      notification_url: `${process.env.APP_URL}/payments/notifications/${hash}`,
      additional_info: {
        items: paymentPayload.items,
        payer: {
          first_name: paymentPayload.name.split(' ')[0],
          last_name: paymentPayload.name.split(' ').pop(),
          address: paymentPayload.user_address,
          phone: paymentPayload.user_phone,
        },
      },
      metadata: {
        payment_id: paymentId,
        cpf: paymentPayload.cpf,
        license_plate: paymentPayload.license_plate,
        credits: paymentPayload.credits,
        region: paymentPayload.region,
      },
    };

    if (paymentPayload.method === 'credit_card') {
      payment.payment_method_id = paymentPayload.card_info.card_brand;
      payment.installments = paymentPayload.installments;
    } else {
      payment.payment_method_id = paymentPayload.method;
    }

    return payment;
  }
}
