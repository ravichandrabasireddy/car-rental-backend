import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { createCarListingDto, findCarListingsDto, updateCarListingDto, updateCarScheduleDto } from './dto/car.dto';
import { AdminRoleGuard } from '../auth/guard/admin.role.guard';
import { JwtGuard } from '../auth/guard/jwt.guard';
@Controller('car')
export class CarController {

    constructor(private readonly carService: CarService) {}

    @UseGuards(AdminRoleGuard)
    @Post('create/listing')
    async createCarListing(@Body() carDto: createCarListingDto) {
        return await this.carService.createCarListing(carDto);
    }

    @UseGuards(AdminRoleGuard)
    @Post('set/schedule/:id')
    async setCarSchedule(@Param('id') id: string, @Body() scheduleDto: updateCarScheduleDto) {
        return await this.carService.setCarSchedule(id, scheduleDto);
    }

    @UseGuards(AdminRoleGuard)
    @Post('delete/listing/:id')
    async deleteCarListing(@Param('id') id: string) {
        return await this.carService.deleteCarListing(id);
    }

    @UseGuards(AdminRoleGuard)
    @Post('update/listing/:id')
    async updateCarListing(@Param('id') id: string, @Body() carDto: updateCarListingDto) {
        return await this.carService.updateCarListing(id, carDto);
    }


    @Get('find/listings')
    async findCarListings(@Query() query: findCarListingsDto) {
        return await this.carService.findCarListings(query);
    }


    @UseGuards(AdminRoleGuard)
    @Get('find/listing/:id')
    async findCarListingById(@Param('id') id: string) {
        return await this.carService.findCarListingById(id);
    }

    @UseGuards(JwtGuard)
    @Get('find/avialablelisting/:id')
    async findAvailableCarListings(@Param('id') id: string) {
        return await this.carService.findAvailableCarListingByID(id);
    }

    @UseGuards(AdminRoleGuard)
    @Get('find/listings/user/:id')
    async findCarListingsByUserId(@Param('id') id: string) {
        return await this.carService.findCarListingsByUserId(id);
    }

    @UseGuards(JwtGuard )
    @Get('get/schedule/:id')
    async getCarSchedule(@Param('id') id: string) {
        return await this.carService.getCarSchedule(id);
    }

    @UseGuards(AdminRoleGuard)
    @Post('update/availability/:id')
    async updateCarAvailability(@Param('id') id: string, @Body() available: boolean) {
        return await this.carService.updateCarAvailability(id, available);
    }
}