import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdvancedSearchDto } from '../dto/advanced-search.dto';
import { Payment } from '../entities/payment.entity';
import {
  CreatePaymentDto,
  IPaymentsRepository,
  UpdatePaymentDto,
} from './i-payments-repository';

@Injectable()
export class PaymentsRepository implements IPaymentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<any> {
    const paymentCreated = await this.prismaService.payment.create({
      data: {
        amount: createPaymentDto.amount,
        created_at: createPaymentDto.created_at,
        status: createPaymentDto.status,
        payment_id: createPaymentDto.payment_id,
        method: createPaymentDto.method,
        description: createPaymentDto.description,
        purchase_to_id: createPaymentDto.purchase_to_id,
        purchase_by_id: createPaymentDto.purchase_by_id,
        hash: createPaymentDto.hash,
      },
    });

    return paymentCreated;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<any> {
    const paymentUpdated = await this.prismaService.payment.update({
      where: { id },
      data: updatePaymentDto,
    });

    return paymentUpdated;
  }

  async findByPaymentId(paymentId: number): Promise<Payment> {
    const paymentFound = await this.prismaService.payment.findUnique({
      where: {
        payment_id: paymentId.toString(),
      },
    });

    return paymentFound;
  }

  async findById(id: number): Promise<Payment> {
    const paymentFound = await this.prismaService.payment.findFirst({
      where: { id },
    });

    return paymentFound;
  }

  async findByUserId(userId: number): Promise<Payment[]> {
    const paymentsFound = await this.prismaService.payment.findMany({
      where: { purchase_to_id: userId },
    });

    return paymentsFound;
  }

  async findByBuyerId(buyerId: number): Promise<Payment[]> {
    const paymentsFound = await this.prismaService.payment.findMany({
      where: { purchase_by_id: buyerId },
    });

    return paymentsFound;
  }

  async findAll(): Promise<Payment[]> {
    const allPayments = await this.prismaService.payment.findMany();

    return allPayments;
  }

  async advancedSearch(
    userId: number,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<Payment[]> {
    const paymentsFound = await this.prismaService.payment.findMany({
      where: {
        id: advancedSearchDto.id,
        purchase_to_id: userId,
        purchase_by_id: advancedSearchDto.buyer_id,
        status: advancedSearchDto.status,
        method: advancedSearchDto.method,
      },
    });

    return paymentsFound;
  }
}
