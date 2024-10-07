import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PaymentsModule } from '../payments/payments.module';
import { ReservationProcessor } from './processor/reservation.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reservations',
    }),
    PaymentsModule
  ],
  providers: [ReservationService, PrismaService, JwtService, ReservationProcessor],
  controllers: [ReservationController]
})
export class ReservationModule {}
