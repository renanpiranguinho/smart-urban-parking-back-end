import { MercadoPagoService } from './../models/payments/mercadopago.service';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { Injectable } from '@nestjs/common';
import { User } from '../models/users/entities/user.entity';
import { CreatePaymentDto } from 'src/models/payments/dto/create-payment.dto';

@Injectable()
export class FormatData {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  async formatPaymentPayload(
    user: User,
    paymentPayload: CreatePaymentDto,
    hash: string,
  ): Promise<CreatePaymentPayload> {
    let payment_method_id = paymentPayload.method;

    if (paymentPayload.method === 'credit_card') {
      payment_method_id = paymentPayload.card_info.card_brand;
    }

    const paymentPayloadFormatted: CreatePaymentPayload = {
      transaction_amount: paymentPayload.amount,
      payer: {
        first_name: user.name.split(' ')[0],
        last_name: user.name.split(' ').pop(),
        email: user.email,
        identification: {
          type: 'CPF',
          number: user.cpf,
        },
      },
      description: paymentPayload.description || 'Pagamento',
      payment_method_id,
      external_reference: hash,
      notification_url: `${process.env.APP_URL}/payments/notifications/${hash}`,
      installments: paymentPayload.installments || 1,
      additional_info: {
        items: paymentPayload.items,
        payer: {
          first_name: user.name.split(' ')[0],
          last_name: user.name.split(' ').pop(),
          address: paymentPayload.user_address,
          phone: paymentPayload.user_phone,
        },
      },
      metadata: {
        hash: hash,
        user_id: user.id,
      },
      token: paymentPayload.token ?? '',
    };

    return paymentPayloadFormatted;
  }
}
