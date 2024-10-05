import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service'; 
import { JwtService } from '@nestjs/jwt';
import { RefreshJwtGuard } from './guard/refresh.guard';
@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, JwtService, RefreshJwtGuard]
})
export class AuthModule {}
