import { IsString, IsEmail, MinLength } from "class-validator";

export class LoginDto {

    @IsString() @IsEmail()
    username: string;

    @IsString() @MinLength(8)
    password: string;
}