import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EncryptData } from 'src/utils/encrypt-data';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsRepository } from './repository/credit-cards-repository';

@Module({
  controllers: [CreditCardsController],
  providers: [
    CreditCardsService,
    PrismaService,
    EncryptData,
    CreditCardsRepository,
  ],
})
export class CreditCardsModule {}
