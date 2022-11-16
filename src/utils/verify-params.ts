import { Injectable } from '@nestjs/common';
import { AdvancedSearchDto } from 'src/models/payments/dto/advanced-search.dto';
import {
  CreatePaymentDto,
  PaymentMethods,
} from 'src/models/payments/dto/create-payment.dto';
import { Status } from '@prisma/client';

@Injectable()
export class VerifyParams {
  async verifyParamsCreateByCard(
    createPaymentDto: CreatePaymentDto,
  ): Promise<string> {
    if (!createPaymentDto.card_info.card_number) {
      return 'Card number is required';
    }

    if (typeof createPaymentDto.card_info.card_number !== 'string') {
      return 'Card number must be a string';
    }

    if (!createPaymentDto.card_info.securityCode) {
      return 'Security code is required';
    }

    if (typeof createPaymentDto.card_info.securityCode !== 'string') {
      return 'Security code must be a string';
    }

    if (!createPaymentDto.card_info.expiration_month) {
      return 'Expiration month is required';
    }

    if (typeof createPaymentDto.card_info.expiration_month !== 'number') {
      return 'Expiration month must be a number';
    }

    if (!createPaymentDto.card_info.expiration_year) {
      return 'Expiration year is required';
    }

    if (typeof createPaymentDto.card_info.expiration_year !== 'number') {
      return 'Expiration year must be a number';
    }

    if (!createPaymentDto.installments) {
      return 'Installments is required';
    }

    if (typeof createPaymentDto.installments !== 'number') {
      return 'Installments must be a number';
    }

    if (createPaymentDto.installments < 1) {
      return 'Installments must be greater than 0';
    }
  }

  async verifyParamsCreateByPresential(
    createPaymentDto: CreatePaymentDto,
  ): Promise<string> {
    if (!createPaymentDto.status) {
      return 'Status is required';
    }

    if (typeof createPaymentDto.status !== 'string') {
      return 'Status must be a string';
    }

    if (!Object.values(Status).includes(createPaymentDto.status)) {
      return 'Status must be a valid status';
    }

    return;
  }

  async verifyParamsList(
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<string> {
    if (advancedSearchDto.id && typeof advancedSearchDto.id !== 'number') {
      return 'Id must be a number';
    }

    if (
      advancedSearchDto.payment_id &&
      typeof advancedSearchDto.payment_id !== 'string'
    ) {
      return 'Payment id must be a string';
    }

    if (
      advancedSearchDto.buyer_id &&
      typeof advancedSearchDto.buyer_id !== 'number'
    ) {
      return 'Purchase to id must be a number';
    }

    if (
      advancedSearchDto.status &&
      typeof advancedSearchDto.status !== 'string'
    ) {
      return 'Status must be a string';
    }

    if (
      advancedSearchDto.status &&
      !Object.values(Status).includes(advancedSearchDto.status)
    ) {
      return 'Status must be a valid status';
    }

    if (
      advancedSearchDto.method &&
      typeof advancedSearchDto.method !== 'string'
    ) {
      return 'Method must be a string';
    }

    if (
      advancedSearchDto.method &&
      !Object.values(PaymentMethods).includes(advancedSearchDto.method)
    ) {
      return 'Method must be a valid method';
    }
  }
}
