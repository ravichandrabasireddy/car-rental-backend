import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createReservationDto } from './dto/reservation.dto';
@Injectable()
export class ReservationService {
	constructor(
		private prisma: PrismaService,
		@InjectQueue('reservations') private reservationsQueue: Queue
	) {}

	async createReservation(createReservationDto: createReservationDto) {
		const { userId, carId, startDate, endDate, totalPrice } = createReservationDto;

		const car = await this.prisma.car.findUnique({
			where: { id: carId, available: true },
		});

		if (!car) {
			throw new NotFoundException('Car not available');
		}

		const reservation = await this.prisma.$transaction(async (prisma) => {
			const newReservation = await prisma.reservation.create({
				data: {
					userId,
					carId,
					startDate,
					endDate,
					totalPrice,
					status: ReservationStatus.PENDING,
				},
			});

			await prisma.car.update({
				where: { id: carId },
				data: { available: false },
			});

			// Add this check
			await prisma.availability.deleteMany({
				where: {
					carId,
					startDate: { lte: endDate },
					endDate: { gte: startDate }
				}
			});

			return newReservation;
		});

		await this.reservationsQueue.add('processReservation', { reservationId: reservation.id }, {
			delay: 5 * 60 * 1000, // 5 minutes
			removeOnComplete: true,
		});

		return reservation;
	}

	async getConfirmedReservation(id: string) {
		const reservation = await this.prisma.reservation.findUnique({
			where: {
				id,
				status: ReservationStatus.CONFIRMED
			},
		});

		if (!reservation) {
			throw new NotFoundException('Reservation not found');
		}
		return reservation;
	}

	async getUserCurrentReservations(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}
		
		return this.prisma.reservation.findMany({
			where: {
				userId: id,
				status: ReservationStatus.CONFIRMED
			},
		});
	}

	async getUserReservationHistory(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.prisma.reservation.findMany({
			where: {
				userId: id,
				status: {
					in: [ReservationStatus.COMPLETED, ReservationStatus.CANCELLED]
				}
			},
		});
	}

	async getAllReservations(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.prisma.reservation.findMany({
			where: {
				userId: id,
				status: {
					in: [ReservationStatus.CONFIRMED, ReservationStatus.CANCELLED, ReservationStatus.COMPLETED]
				}
			},
		});
	}

	async cancelReservation(id: string) {
		const reservation = await this.prisma.reservation.findUnique({
			where: { id },
			include: { car: true },
		});
		
		if (!reservation) {
			throw new NotFoundException('Reservation not found');
		}

		return this.prisma.$transaction(async (prisma) => {
			const updatedReservation = await prisma.reservation.update({
				where: { id },
				data: {
					status: ReservationStatus.CANCELLED,
				}
			});

			await prisma.car.update({
				where: { id: reservation.carId },
				data: { available: true },
			});

			return updatedReservation;
		});
	}


}