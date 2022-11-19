import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/models/payments/dto/create-payment.dto';
import { Status } from '@prisma/client';
import { CardBrands } from 'src/models/payments/enums/card-brands.enum';

@Injectable()
export class VerifyParams {
  async verifyParamsCard(createPaymentDto: CreatePaymentDto): Promise<string> {
    if (!createPaymentDto.card_info) {
      return 'card_info is required';
    }

    if (!createPaymentDto.card_info.card_number) {
      return 'card_number is required';
    }

    if (typeof createPaymentDto.card_info.card_number !== 'string') {
      return 'card_number must be a string';
    }

    if (!createPaymentDto.card_info.card_brand) {
      return 'card_brand is required';
    }

    if (CardBrands[createPaymentDto.card_info.card_brand] === undefined) {
      return 'card_brand is not valid';
    }

    if (!createPaymentDto.card_info.expiration_month) {
      return 'expiration_month is required';
    }

    if (typeof createPaymentDto.card_info.expiration_month !== 'number') {
      return 'expiration_month must be a number';
    }

    if (!createPaymentDto.card_info.expiration_year) {
      return 'expiration_year is required';
    }

    if (typeof createPaymentDto.card_info.expiration_year !== 'number') {
      return 'expiration_year must be a number';
    }

    if (!createPaymentDto.card_info.securityCode) {
      return 'securityCode is required';
    }

    if (typeof createPaymentDto.card_info.securityCode !== 'string') {
      return 'securityCode must be a string';
    }

    if (!createPaymentDto.card_info.card_holder_name) {
      return 'holder_name is required';
    }

    if (typeof createPaymentDto.card_info.card_holder_name !== 'string') {
      return 'holder_name must be a string';
    }

    if (!createPaymentDto.card_info.card_holder_cpf) {
      return 'holder_cpf is required';
    }

    if (typeof createPaymentDto.card_info.card_holder_cpf !== 'string') {
      return 'holder_cpf must be a string';
    }

    return;
  }

  async verifyParamsPresential(
    createPaymentDto: CreatePaymentDto,
  ): Promise<string> {
    if (!createPaymentDto.buyer_id) {
      return 'buyer_id is required';
    }

    if (typeof createPaymentDto.buyer_id !== 'number') {
      return 'buyer_id must be a number';
    }

    if (!createPaymentDto.status) {
      return 'status is required';
    }

    if (Status[createPaymentDto.status] === undefined) {
      return 'status is invalid';
    }

    return;
  }
}
