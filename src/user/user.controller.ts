import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdateUserDto } from './dto/user.dto';


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(id);
    }

    @UseGuards(JwtGuard)
    @Post("update/:id")
    async updateUser(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(id, updateUserDto);
    }

}
