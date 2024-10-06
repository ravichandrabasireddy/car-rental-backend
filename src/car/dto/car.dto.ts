import { CarType } from "@prisma/client";
import { IsString, IsNumber, IsOptional, IsDate, IsEnum, Min, Max } from "class-validator";

export class createCarListingDto {
    @IsString()
    name: string;

    @IsString()
    userId: string;

    @IsEnum(CarType)
    type: CarType;

    @IsNumber() @Min(0) @Max(1000)
    dailyRate: number;

    @IsString()
    pickupAddress: string;

    @IsString()
    dropOffAddress: string;
    
    @IsString() @IsOptional()
    image: string;
}

export class updateCarListingDto {
    @IsString() @IsOptional()
    name: string;

    @IsNumber() @IsOptional() @Min(0) @Max(1000)
    dailyRate: number;

    @IsString() @IsOptional()
    image: string;

    @IsString() @IsOptional()
    pickupAddress: string;

    @IsString() @IsOptional()
    dropOffAddress: string;
}

export class updateCarScheduleDto {
    @IsString()
    carId: string;

    @IsDate()
    startDate: Date;

    @IsDate()   
    endDate: Date;
}

export class findCarListingsDto {
    @IsString()
    pickupAddress: string;

    @IsString()
    dropOffAddress: string;

    @IsNumber() @IsOptional() @Min(0) @Max(10000)
    minDailyRate: number;

    @IsNumber() @IsOptional() @Min(0) @Max(10000)
    maxDailyRate: number;

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;

    @IsString() @IsOptional()
    type: string;
    
    
}