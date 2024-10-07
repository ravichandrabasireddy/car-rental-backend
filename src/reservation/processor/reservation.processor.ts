import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { ReservationStatus } from '@prisma/client';

@Processor('reservations')
export class ReservationProcessor {
  constructor(private prisma: PrismaService) {}

  @Process('processReservation')
  async handleReservationTimeout(job: Job<{ reservationId: string }>) {
    const { reservationId } = job.data;

    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { car: true },
    });

    if (!reservation) {
      return;
    }

    if (reservation.status === ReservationStatus.PENDING) {
      // If payment not completed within 5 minutes, cancel reservation and make car available
      await this.prisma.$transaction(async (prisma) => {
        await prisma.reservation.update({
          where: { id: reservationId },
          data: { status: ReservationStatus.CANCELLED },
        });

        await prisma.availability.updateMany({
          where: {
            carId: reservation.carId,
            startDate: { lte: reservation.endDate },
            endDate: { gte: reservation.startDate },
            isDeleted: true
          },
          data: { isDeleted: false }
        });

        await prisma.car.update({
          where: { id: reservation.carId },
          data: { available: true },
        });
      });
    }
  }
}