import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export class createCardInfoDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    number: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    expiryDate: Date;  

    @IsNotEmpty()
    @IsString()
    cvv: string;
}   



export class createPaymentDto {

    @IsNotEmpty()
    @IsString()
    reservationId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    paymentMethod: string;


    @IsOptional()
    @IsString()
    paymentStatus: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => createCardInfoDto)  
    cardInfo: createCardInfoDto;
    
}