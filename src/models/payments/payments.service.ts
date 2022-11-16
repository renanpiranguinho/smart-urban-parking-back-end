import {
  //BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, PaymentMethods } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentsRepository } from './repository/payments.repository';
import { MercadoPagoService } from './mercadopago.service';
import { UsersService } from '../users/users.service';
import { FormatData } from './../../utils/format-data';
import { v4 } from 'uuid';
import { UpdatePaymentDto } from './repository/i-payments-repository';
import { VerifyParams } from 'src/utils/verify-params';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly usersService: UsersService,
    private readonly formatData: FormatData,
    private readonly verifyParams: VerifyParams,
  ) {}

  // if exists buyer_id, then create payment with buyer_id
  async create(
    createPaymentDto: CreatePaymentDto,
    buyerId?: number,
  ): Promise<any> {
    const user = await this.usersService.findById(createPaymentDto.user_id);
    const hash = v4();
    let paymentIdNumber: number;
    let payment: any = {};
    let cardToken: any = {};

    if (user.is_active === false) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    do {
      paymentIdNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    } while (await this.paymentsRepository.findByPaymentId(paymentIdNumber));

    if (createPaymentDto.method !== PaymentMethods.presential) {
      if (createPaymentDto.method === PaymentMethods.credit_card) {
        const verifyMessage = await this.verifyParams.verifyParamsCreateByCard(
          createPaymentDto,
        );

        if (verifyMessage) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: verifyMessage,
          });
        }

        createPaymentDto.card_info.card_number =
          createPaymentDto.card_info.card_number.replace(/\s/g, '');

        cardToken = await this.mercadoPagoService
          .createCardToken(createPaymentDto.card_info)
          .then((response) => {
            return response.body;
          })
          .catch((error) => {
            return error;
          });

        if (cardToken.status === 400) {
          let causes = '';

          cardToken.cause.forEach((cause: any) => {
            causes += cause.description + ', ';
          });

          causes = causes.slice(0, -2);

          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: causes,
          });
        }

        createPaymentDto.token = cardToken.id;
      }

      const payloadPayment = await this.formatData.formatPaymentPayload(
        user,
        createPaymentDto,
        hash,
      );

      payment = await this.mercadoPagoService
        .createPayment(payloadPayment)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          return error;
        });

      if (payment.status === 400) {
        let causes = '';

        payment.cause.forEach((cause: any) => {
          causes += cause.description + ', ';
        });

        causes = causes.slice(0, -2);

        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: causes,
        });
      }

      payment.body.status = payment.body.status.toLowerCase().replace('_', '');
    }

    if (createPaymentDto.method === PaymentMethods.presential) {
      const verifyMessage =
        await this.verifyParams.verifyParamsCreateByPresential(
          createPaymentDto,
        );

      if (verifyMessage) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: verifyMessage,
        });
      }
    }

    const paymentInfo = {
      amount: payment.body
        ? payment.body.transaction_amount
        : createPaymentDto.amount,
      created_at: payment.body ? payment.body.date_created : new Date(),
      payment_id: payment.body
        ? payment.body.id.toString()
        : paymentIdNumber.toString(),
      status: payment.body ? payment.body.status : createPaymentDto.status,
      method: createPaymentDto.method,
      description: createPaymentDto.description ?? '',
      purchase_to_id: user.id,
      purchase_by_id: buyerId ?? user.id,
      hash: hash,
    };

    const paymentCreated = await this.paymentsRepository.create(paymentInfo);

    const paymentResponse = {
      paymentCreated,
      transactionData: payment.body
        ? payment.body.point_of_interaction.transaction_data
        : null,
    };

    return paymentResponse;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<any> {
    const paymentUpdated = await this.paymentsRepository.update(
      id,
      updatePaymentDto,
    );

    return paymentUpdated;
  }

  async findByPaymentId(paymentId: number, hash: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findByPaymentId(paymentId);

    if (!payment || payment.hash !== hash) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payment not found',
      });
    }

    return payment;
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.paymentsRepository.findAll();

    return payments;
  }

  async findById(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findById(id);

    if (!payment) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payment not found',
      });
    }

    return payment;
  }

  async findByUserId(userId: number): Promise<Payment[]> {
    const payments = await this.paymentsRepository.findByUserId(userId);

    if (!payments || payments.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payments not found',
      });
    }

    return payments;
  }

  async findByBuyerId(buyerId: number): Promise<any[]> {
    const payments = await this.paymentsRepository.findByBuyerId(buyerId);

    if (!payments || payments.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payments not found',
      });
    }

    return payments;
  }

  async advancedSearch(
    userId: number,
    AdvancedSearchDto: AdvancedSearchDto,
  ): Promise<Payment[]> {
    const verifyParams = await this.verifyParams.verifyParamsList(
      AdvancedSearchDto,
    );

    if (verifyParams) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: verifyParams,
      });
    }

    const payments = await this.paymentsRepository.advancedSearch(
      userId,
      AdvancedSearchDto,
    );

    if (!payments || payments.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payments not found',
      });
    }

    if (AdvancedSearchDto.aditional_info) {
      for (const payment of payments) {
        if (payment.method !== PaymentMethods.presential) {
          await this.mercadoPagoService
            .getPayment(+payment.payment_id)
            .then((response) => {
              payment['aditional_info'] = response.body;
            })
            .catch((error) => {
              payment['aditional_info'] = error;
            });
        } else {
          payment['aditional_info'] = 'No available';
        }
      }
    }

    return payments;
  }

  async nofityPayment(body: any, hash: string): Promise<any> {
    const paymentId = body.data.id ?? body.resource.split('/').pop();

    if (paymentId && hash) {
      const paymentExists = await this.paymentsRepository.findByPaymentId(
        paymentId,
      );

      if (paymentExists && paymentExists.hash === hash) {
        const payment = await this.mercadoPagoService.getPayment(paymentId);
        const paymentStatus = payment.body.status
          .toLowerCase()
          .replace('_', '');

        if (
          payment.body &&
          paymentStatus !== paymentExists.status &&
          payment.body.external_reference === hash
        ) {
          await this.paymentsRepository.update(paymentExists.id, {
            status: paymentStatus,
            updated_at: new Date(),
          });

          //  Executar ações de acordo com o status do pagamento
          if (payment.body.status === 'approved') {
            console.log('approved');
          } else if (payment.body.status === 'rejected') {
            console.log('rejected');
          } else if (payment.body.status === 'refunded') {
            console.log('refunded');
          } else if (payment.body.status === 'cancelled') {
            console.log('cancelled');
          } else if (payment.body.status === 'in_process') {
            console.log('in_process');
          } else if (payment.body.status === 'in_mediation') {
            console.log('in_mediation');
          } else if (payment.body.status === 'charged_back') {
            console.log('charged_back');
          } else if (payment.body.status === 'pending') {
            console.log('pending');
          }
        }
      }

      return 'ok';
    }

    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'error',
    });
  }
}
