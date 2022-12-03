import { UpdatePaymentInterface } from './interfaces/update-payment.interface';
import { PaymentMethods } from './enums/payment-method.enum';
import {
  //BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentsRepository } from './repository/payments.repository';
import { MercadoPagoService } from './mercadopago.service';
import { FormatData } from './../../utils/format-data';
import { v4 } from 'uuid';
import { VerifyParams } from 'src/utils/verify-params';
import { Status } from '@prisma/client';
import { VehicleRepository } from '../vehicles/repository/vehicle.repository';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { SendMailService } from 'src/mail/send-mail.service';
import format from 'date-fns/format';
import { UsersRepository } from '../users/repository/user.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly formatData: FormatData,
    private readonly verifyParams: VerifyParams,
    private readonly sendMailService: SendMailService,
    private readonly usersRepository: UsersRepository,
  ) {}

  // if exists buyer_id, then create payment with buyer_id
  async create(createPaymentDto: CreatePaymentDto): Promise<any> {
    const hash = v4();
    const region = createPaymentDto.region;
    let payment: any = {};
    let tokenId: string;
    let paymentId: number;
    let transactionAmount = 0;
    let aditionalData: any = {};
    const status =
      createPaymentDto.method === PaymentMethods.presential
        ? createPaymentDto.status
        : Status.pending;

    if (!region) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Region not found',
      });
    }

    transactionAmount = region * createPaymentDto.credits; //  Mudar quando houver a feature de região
    transactionAmount = 0.55;

    if (createPaymentDto.method === PaymentMethods.presential) {
      const verify = await this.verifyParams.verifyParamsPresential(
        createPaymentDto,
      );

      if (verify) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: verify,
        });
      }
    } else if (createPaymentDto.method === PaymentMethods.credit_card) {
      const verify = await this.verifyParams.verifyParamsCard(createPaymentDto);

      if (verify) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: verify,
        });
      }

      createPaymentDto.card_info.card_number =
        createPaymentDto.card_info.card_number.replace(/\s/g, '');

      const token = await this.mercadoPagoService.createCardToken({
        card_number: createPaymentDto.card_info.card_number,
        securityCode: createPaymentDto.card_info.securityCode,
        expiration_month: createPaymentDto.card_info.expiration_month,
        expiration_year: createPaymentDto.card_info.expiration_year,
        cardholder: {
          name: createPaymentDto.card_info.card_holder_name,
          identification: {
            type: 'CPF',
            number: createPaymentDto.card_info.card_holder_cpf,
          },
        },
      });

      if (token.status !== 201) {
        token.cause.forEach((cause: any) => {
          delete cause.code;
        });

        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: token.cause,
        });
      }

      tokenId = token.body.id;
    }

    let vehicle_id = createPaymentDto.vehicle_id;
    let vehicle: Vehicle;
    let license_plate = createPaymentDto.license_plate;

    if (license_plate) {
      license_plate = license_plate.replace(/[\-]/g, '').toUpperCase();

      vehicle = await this.vehicleRepository.create({
        name: 'Uknown car',
        license_plate: license_plate,
      });
      vehicle_id = vehicle.id;
    } else {
      vehicle = await this.vehicleRepository.findById(vehicle_id);
    }

    const paymentCreated = await this.paymentsRepository.create({
      amount: transactionAmount,
      created_at: new Date(),
      hash,
      status: status,
      name: createPaymentDto.name,
      cpf: createPaymentDto.cpf,
      credits: createPaymentDto.credits,
      region: region,
      license_plate: license_plate ?? vehicle.license_plate,
      vehicleId: vehicle_id,
      description: createPaymentDto.description,
      method: createPaymentDto.method,
      buyer_id: createPaymentDto.buyer_id,
      payment_id: paymentId,
    });

    if (createPaymentDto.method !== PaymentMethods.presential) {
      const paymentPayload = await this.formatData.formatPaymentPayload(
        createPaymentDto,
        hash,
        tokenId,
        transactionAmount,
        paymentCreated.id,
      );

      payment = await this.mercadoPagoService.createPayment(paymentPayload);

      if (payment.status === 500) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Erro com o Mercado Pago',
        });
      }

      if (payment.status !== 201) {
        payment.cause.forEach((cause: any) => {
          delete cause.code;
          delete cause.data;
        });

        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: payment.cause,
        });
      }

      paymentId = payment.body.id;

      if (createPaymentDto.method === PaymentMethods.pix) {
        aditionalData = {
          pix_qr_code:
            payment.body.point_of_interaction.transaction_data.qr_code,
          mp_ticket_url:
            payment.body.point_of_interaction.transaction_data.ticket_url,
          pix_qr_code_base64:
            payment.body.point_of_interaction.transaction_data.qr_code_base64,
        };
      }
    }

    return {
      payment: paymentCreated,
      aditional_data: aditionalData,
    };
  }

  async update(
    id: number,
    updatePayment: UpdatePaymentInterface,
  ): Promise<any> {
    const paymentUpdated = await this.paymentsRepository.update(
      id,
      updatePayment,
    );

    return paymentUpdated;
  }

  async findAll(license_plate?: string): Promise<Payment[]> {
    if (license_plate)
      license_plate = license_plate.replace(/[\-]/g, '').toUpperCase();

    const payments = await this.paymentsRepository.findAll(license_plate);

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

  async findByUser(cpf: string): Promise<Payment[]> {
    const payments = await this.paymentsRepository.findByUser(cpf);

    if (!payments || payments.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payments not found',
      });
    }

    return payments;
  }

  async findByBuyer(buyerId: number): Promise<any[]> {
    const payments = await this.paymentsRepository.findByBuyer(buyerId);

    if (!payments || payments.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payments not found',
      });
    }

    return payments;
  }

  async nofityPayment(body: any, hash: string): Promise<any> {
    const paymentId = body.data.id ?? body.resource.split('/').pop();

    if (paymentId && hash) {
      const payment = await this.mercadoPagoService.getPayment(paymentId);
      const status = payment.body.status.toLowerCase().replace('_', ' ');
      const credits = payment.body.metadata.payment_id;

      if (payment.status === 200) {
        const paymentExists = await this.paymentsRepository.findById(
          payment.body.metadata.payment_id,
        );

        if (paymentExists && paymentExists.hash === hash) {
          if (status !== Status.pending && status !== paymentExists.status) {
            const updatePayment = await this.paymentsRepository.update(
              paymentExists.id,
              {
                status: status,
                payment_id: parseInt(paymentId),
                updated_at: new Date(),
              },
            );

            if (updatePayment) {
              if (status === Status.approved) {
                const valid_until = new Date();
                valid_until.setHours(valid_until.getHours() + credits);

                const updatedPayment = await this.paymentsRepository.update(
                  paymentExists.id,
                  {
                    valid_until: valid_until,
                    updated_at: new Date(),
                  },
                );

                const confirmedPayment =
                  await this.mercadoPagoService.getPayment(
                    updatedPayment.payment_id,
                  );

                if (confirmedPayment) {
                  const email = confirmedPayment?.payer?.email;

                  if (email) {
                    this.sendMailService.sendPaymentVoucherMail({
                      email: email,
                      license_plate: updatedPayment.license_plate,
                      name: updatedPayment.name,
                      price: `R$ ${String(updatedPayment.amount).replace(
                        '.',
                        ',',
                      )}`,
                      validity: format(valid_until, 'dd/MM/yyyy hh:mm:ss'),
                    });
                  }
                }

                console.log('approved');
              } else if (status === Status.rejected) {
                console.log('rejected');
              } else if (status === Status.cancelled) {
                console.log('cancelled');
              } else if (status === Status.refunded) {
                console.log('refunded');
              } else if (status === Status.inprocess) {
                console.log('in_process');
              } else if (status === Status.inmediation) {
                console.log('in_mediation');
              } else if (status === Status.chargedback) {
                console.log('charged_back');
              }

              return {
                status: 'OK',
              };
            }
          }
        }
      }
    }

    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'error',
    });
  }

  async getPaymentsForTask(date: Date): Promise<any[]> {
    const payments = await this.paymentsRepository.findApprovedByDate(date);

    return payments;
  }
}
