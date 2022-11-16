import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NestResponse } from '../../core/http/nestResponse';
import { NestResponseBuilder } from '../../core/http/nestResponseBuilder';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createByUser(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<NestResponse> {
    const createdPayment = await this.paymentsService.create(createPaymentDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/payments/${createdPayment.id}` })
      .setBody(createdPayment)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/buyer/:id')
  async createToUser(
    @Body() createPaymentDto: CreatePaymentDto,
    @Param('id') id: number,
  ): Promise<NestResponse> {
    const createdPayment = await this.paymentsService.create(
      createPaymentDto,
      id,
    );

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/payments/${createdPayment.id}` })
      .setBody(createdPayment)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<NestResponse> {
    const payments = await this.paymentsService.findAll();

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(payments)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findById(@Param('id') id: string): Promise<NestResponse> {
    const payment = await this.paymentsService.findById(+id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(payment)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user/:id')
  async findByUserId(@Param('id') id: string): Promise<NestResponse> {
    const payments = await this.paymentsService.findByUserId(+id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(payments)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('buyer/:id')
  async findByBuyerId(@Param('id') id: string): Promise<NestResponse> {
    const payments = await this.paymentsService.findByBuyerId(+id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(payments)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('advanced-search/:id')
  async advancedSearch(
    @Body() advancedSearchDto: AdvancedSearchDto,
    @Param('id') id: number,
  ): Promise<NestResponse> {
    const payments = await this.paymentsService.advancedSearch(
      id,
      advancedSearchDto,
    );

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(payments)
      .build();

    return response;
  }

  // notify hook
  @Post('notifications/:hash')
  async notify(
    @Body() body: any,
    @Param('hash') hash: string,
  ): Promise<NestResponse> {
    await this.paymentsService.nofityPayment(body, hash);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody('ok')
      .build();

    return response;
  }
}
