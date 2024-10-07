import { Controller, Get, Param, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { createReservationDto } from './dto/reservation.dto';

@Controller('reservation')
export class ReservationController {

    constructor(private reservationService: ReservationService) {}

    @UseGuards(JwtGuard)
    @Get('confirmed/:id')
    async getConfirmedReservation(@Param('id') id: string) {
        return this.reservationService.getConfirmedReservation(id);
    }      

    @UseGuards(JwtGuard)
    @Get('all/:id')
    async getAllReservations(@Param('id') id: string) {
        return this.reservationService.getAllReservations(id);
    }
        
    @UseGuards(JwtGuard)
    @Get('user/:id')
    async getUserCurrentReservations(@Param('id') id: string) {
        return this.reservationService.getUserCurrentReservations(id);
    }


    @UseGuards(JwtGuard)
    @Get('user/:id/history')
    async getUserReservationHistory(@Param('id') id: string) {
        return this.reservationService.getUserReservationHistory(id);
    }

    @UseGuards(JwtGuard)
    @Post('cancel/:id')
    async cancelReservation(@Param('id') id: string) {
        return this.reservationService.cancelReservation(id);
    }

    @UseGuards(JwtGuard)
    @Post('create')
    async createReservation(@Body(ValidationPipe) dto: createReservationDto) {
        return this.reservationService.createReservation(dto);
    }

}