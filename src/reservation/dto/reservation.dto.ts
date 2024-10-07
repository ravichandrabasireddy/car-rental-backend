import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';


export class createReservationDto {

    @IsNotEmpty() 
    @IsString()
    carId: string;

    @IsNotEmpty() 
    @IsString()
    userId: string;

    @IsNotEmpty() 
    @IsDateString()
    startDate: Date;

    @IsNotEmpty() 
    @IsDateString()
    endDate: Date;

    @IsNotEmpty() 
    @IsNumber()
    totalPrice: number;
    
    
}

export class addCardInfoDto {
    @IsNotEmpty() 
    @IsString()
    name: string;

    @IsNotEmpty() 
    @IsString()
    number: string;

    @IsNotEmpty() 
    @IsDateString()
    expiryDate: Date;

    @IsNotEmpty() 
    @IsString()
    cvv: string;
}

export class updateReservationDto {

    @IsNotEmpty() 
    @IsString()
    id: string;

    @IsNotEmpty() 
    @IsString()
    @IsOptional()
    status: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => addCardInfoDto)
    cardInfo: addCardInfoDto;
}