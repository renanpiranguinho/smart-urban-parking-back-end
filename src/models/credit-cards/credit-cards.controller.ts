import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { NestResponse } from '../../core/http/nestResponse';
import { NestResponseBuilder } from 'src/core/http/nestResponseBuilder';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';

@ApiTags('Cards')
@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  async create(@Body() createCreditCardDto: CreateCreditCardDto) {
    const newCard = await this.creditCardsService.create(createCreditCardDto);
    //console.log(newCard);
    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/cards/${newCard.id}` })
      .setBody(newCard)
      .build();
    return response;
  }

  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<NestResponse> {
    const allCards = await this.creditCardsService.findAll();

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(allCards)
      .build();

    return response;
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<NestResponse> {
    const cardFound = await this.creditCardsService.findById(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(cardFound)
      .build();

    return response;
  }

  @ApiBearerAuth()
  @Get('user/:userId')
  async findAllByUser(@Param('userId') id: number): Promise<NestResponse> {
    const allCards = await this.creditCardsService.findByUserId(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(allCards)
      .build();

    return response;
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ): Promise<NestResponse> {
    const updatedCard = await this.creditCardsService.update(
      id,
      updateCreditCardDto,
    );

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(updatedCard)
      .build();

    return response;
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<NestResponse> {
    const deletedCard = await this.creditCardsService.remove(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(deletedCard)
      .build();

    return response;
  }
}
