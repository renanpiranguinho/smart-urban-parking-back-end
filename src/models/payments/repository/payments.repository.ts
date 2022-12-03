import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentInterface } from '../interfaces/create-payment.interface';
import { UpdatePaymentInterface } from '../interfaces/update-payment.interface';
import { IPaymentsRepository } from './i-payments-repository';

@Injectable()
export class PaymentsRepository implements IPaymentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPayment: CreatePaymentInterface): Promise<any> {
    const paymentCreated = await this.prismaService.payment.create({
      data: createPayment,
    });

    return paymentCreated;
  }

  async update(
    id: number,
    updatePayment: UpdatePaymentInterface,
  ): Promise<Payment> {
    const paymentUpdated = await this.prismaService.payment.update({
      where: { id },
      data: {
        ...updatePayment,
      },
    });

    return paymentUpdated;
  }

  async findById(id: number): Promise<Payment> {
    const paymentFound = await this.prismaService.payment.findFirst({
      where: { id },
    });

    return paymentFound;
  }

  async findByUser(cpf: string): Promise<Payment[]> {
    const paymentsFound = await this.prismaService.payment.findMany({
      where: { cpf },
    });

    return paymentsFound;
  }

  async findByBuyer(buyerId: number): Promise<Payment[]> {
    const paymentsFound = await this.prismaService.payment.findMany({
      where: { buyer_id: buyerId },
    });

    return paymentsFound;
  }

  async findAll(license_plate?: string): Promise<Payment[]> {
    const allPayments = await this.prismaService.payment.findMany({
      where: {
        license_plate: {
          contains: license_plate,
        },
      },
    });
    return allPayments;
  }

  async findApprovedByDate(date: Date): Promise<Payment[]> {
    const paymentsFound = await this.prismaService.payment.findMany({
      where: {
        status: 'approved',
        valid_until: {
          gte: date,
        },
      },
    });

    return paymentsFound;
  }
}
