import { IsString, IsEnum, IsObject, IsOptional } from "class-validator";
import { Address, Role } from "@prisma/client";


export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsEnum(Role)
    role: Role; 
}