import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';
import { createCardInfoDto, createPaymentDto, PaymentStatus } from './dto/payment.dto';
import { ReservationStatus } from '../reservation/dto/reservation.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';


@Injectable()
export class PaymentsService {
	constructor(
		private prisma: PrismaService,
		@InjectQueue('payments') private paymentsQueue: Queue,
		@InjectQueue('reservations') private reservationsQueue: Queue
	) {}

	async createPayment(createPaymentDto: createPaymentDto) {
		const { reservationId, amount, paymentMethod, cardInfo } = createPaymentDto;

		const reservation = await this.prisma.reservation.findUnique({
			where: { id: reservationId },
		});

		if (!reservation || reservation.status !== ReservationStatus.PENDING) {
			throw new NotFoundException('Reservation not found or not in pending state');
		}

		const payment = await this.prisma.paymentInfo.create({
			data: {
				reservationId,
				amount,
				paymentMethod,
				paymentStatus: PaymentStatus.PENDING,
				cardInfo: cardInfo ? {
					create: await this.hashCardInfo(cardInfo)
				} : undefined
			},
		});

		// Add payment to processing queue
		await this.paymentsQueue.add('processPayment', { paymentId: payment.id }, {
			delay: 1000, // 1 second delay to simulate payment processing initiation
		});

		return payment;
	}

	async simulatePayment(paymentId: string): Promise<PaymentStatus> {
		const payment = await this.prisma.paymentInfo.findUnique({
			where: { id: paymentId },
			include: { reservation: true },
		});

		if (!payment) {
			throw new NotFoundException('Payment not found');
		}

		// Update reservation status to processing
		await this.prisma.reservation.update({
			where: { id: payment.reservationId },
			data: { status: ReservationStatus.PROCESSING },
		});

		// Simulate payment processing delay
		const processingTime = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
		await new Promise(resolve => setTimeout(resolve, processingTime));

		// Simulate payment result (80% success rate)
		const isSuccessful = Math.random() < 0.8;
		const finalStatus = isSuccessful ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

		// Update payment and reservation status based on the result
		await this.prisma.$transaction(async (prisma) => {
			await prisma.paymentInfo.update({
				where: { id: paymentId },
				data: { paymentStatus: finalStatus },
			});

			await prisma.reservation.update({
				where: { id: payment.reservationId },
				data: { 
					status: isSuccessful ? ReservationStatus.CONFIRMED : ReservationStatus.FAILED 
				},
			});
		});

		if (isSuccessful) {
			// Remove the reservation from the queue if payment is successful
			await this.reservationsQueue.removeJobs(`processReservation:${payment.reservationId}`);
		}

		return finalStatus;
	}

	async hashCardInfo(cardInfo: createCardInfoDto) {
		return {
			...cardInfo,
			number: await hash(cardInfo.number, 10),
			cvv: await hash(cardInfo.cvv, 10),
			expiryDate: new Date(cardInfo.expiryDate)
		}
	}
}