import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ReservationModule } from './reservation/reservation.module';
import { CarModule } from './car/car.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service'; 
import { BlobModule } from './blob/blob.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, ReservationModule, CarModule, AuthModule, BlobModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
