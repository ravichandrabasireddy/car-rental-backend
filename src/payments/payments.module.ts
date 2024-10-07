import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentProcessor } from './processor/payment.processor';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'payments' },
      { name: 'reservations' }
    ),
  ],
  providers: [PaymentsService, PaymentProcessor, PrismaService],
  controllers: [PaymentsController],
  exports: [PaymentsService, BullModule],
})
export class PaymentsModule {}