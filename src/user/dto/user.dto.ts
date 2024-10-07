import { IsString, IsEnum, IsOptional, IsEmail, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class CreateUserDto {

        
    @IsString()
    name: string;

    @IsString() @IsEmail()
    email: string;

    @IsString() @MinLength(8)
    password: string;

    @IsEnum(Role)
    role: Role; 
}


export class UpdateUserAddressDto {
    @IsString() @IsOptional()
    street: string;

    @IsString() @IsOptional()
    city: string;
    
    @IsString() @IsOptional()
    state: string;

    @IsString() @IsOptional()
    country: string;

    @IsString() @IsOptional()
    zip: string;
}

export class UpdateUserDto {
    @IsString() @IsOptional()
    phoneNumber: string;


    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateUserAddressDto)
    address: UpdateUserAddressDto;
    
}
