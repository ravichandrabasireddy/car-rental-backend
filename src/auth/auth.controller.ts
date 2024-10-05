import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guard/refresh.guard';
@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly refreshJwtService: RefreshJwtGuard
    ) {}

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return await this.userService.createUser(dto);
    }


    @Post('login')
    async login(@Body() dto: LoginDto) {
        return await this.authService.login(dto); 
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refresh(@Request() req) {
        return await this.authService.refreshToken(req.user);
    }
}
