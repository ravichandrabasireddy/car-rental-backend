import { Injectable } from '@nestjs/common';
import { createCarListingDto, updateCarListingDto, updateCarScheduleDto, findCarListingsDto } from './dto/car.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CarService {

    constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}

    async createCarListing(carDto: createCarListingDto) {

        const user = await this.userService.getUserById(carDto.userId);

        if (!user) { 
            throw new Error('User not found');
        }

        return await this.prisma.car.create({
            data: {
                name: carDto.name,
                type: carDto.type,
                dailyRate: carDto.dailyRate,
                pickupAddress: carDto.pickupAddress,
                dropOffAddress: carDto.dropOffAddress,
                image: carDto.image,
                available: true,
                user: {
                    connect: {
                        id: carDto.userId
                    }
                }
            }
        });
    }

    async updateCarListing(id: string, carDto: updateCarListingDto) {
        return await this.prisma.car.update({
            where: {
                id: id
            },
            data: {
                ...carDto
            }
        });
    }


    async setCarSchedule(id: string, carDto: updateCarScheduleDto) {

        const startDate = new Date(carDto.startDate);
        const endDate = new Date(carDto.endDate);

        if (startDate >= endDate) {
            throw new Error('Start date must be before end date');
        }

        const car = await this.prisma.car.findUnique({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (!car) { 
            throw new Error('Car not found');
        }

        if(car.available == false){
            throw new Error('Car is not available');
        }

        const availability = await this.prisma.availability.findMany({
            where: {
                carId: id,
                isDeleted: false,
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate }
                    },
                    {
                        startDate: { gte: startDate, lte: endDate }
                    },
                    {
                        endDate: { gte: startDate, lte: endDate }
                    }
                ]
            }
        });

        if (availability.length > 0) {
            throw new Error('Car is already booked for this date range');
        }



        return await this.prisma.availability.create({
            data: {
                carId: id,
                startDate: carDto.startDate,
                endDate: carDto.endDate
            }
        });
    }

    async deleteCarListing(id: string) {

        const car = await this.prisma.car.findUnique({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (!car) { 
            throw new Error('Car not found');
        }

        return await this.prisma.car.update({
            where: {
                id: id
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

    }

    async findCarListings(query: findCarListingsDto) {

        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);

        if (startDate >= endDate) {
            throw new Error('Start date must be before end date');
        }

        const minDailyRate = query.minDailyRate || 0;
        const maxDailyRate = query.maxDailyRate || 1000;
        
        if (minDailyRate > maxDailyRate) {
            throw new Error('Min daily rate must be less than max daily rate');
        }

        return await this.prisma.car.findMany(
            {
                where: {
                    pickupAddress: query.pickupAddress,
                    dropOffAddress: query.dropOffAddress,
                    dailyRate: {
                        gte: minDailyRate,
                        lte: maxDailyRate
                    },
                    available: true,
                    isDeleted: false,
                    availability: {
                        some: {
                            startDate: {
                                gte: query.startDate
                            },
                            endDate: {
                                lte: query.endDate
                            }
                        }
                    }
                }
            }
        );
    }

    async findCarListingById(id: string) {
        const car = await this.prisma.car.findUnique({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (!car) { 
            throw new Error('Car not found');
        }

        return car;
    }

    
    async findAvailableCarListingByID(id: string) {
        const car = await this.prisma.car.findUnique({
            where: {
                id: id,
                isDeleted: false,
                available: true
            }
        });

        if (!car) { 
            throw new Error('Car not found');
        }

        return car;
    }

    async findCarListingsByUserId(id: string) {
        const car = await this.prisma.car.findMany({
            where: {
                userId: id,
                isDeleted: false
            }
        });

        if (!car) { 
            throw new Error('Car not found');
        }

        return car;
    }

   

    async getCarSchedule(id: string) {
        return await this.prisma.availability.findMany({
            where: {
                carId: id,
                isDeleted:false,
                startDate: {
                    gte: new Date(new Date().setDate(new Date().getDate() + 1))
                }
            }
        });
    }

    async updateCarAvailability(id: string, available: boolean) {

        const car = await this.prisma.car.findUnique({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (!car) { 
            throw new Error('Car not found');
        }
        return await this.prisma.car.update({
            where: {
                id: id,
                isDeleted: false
            },
            data: {
                available: available
            }
        });
    }


}
