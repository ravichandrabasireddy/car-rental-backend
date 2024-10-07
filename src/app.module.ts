import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { UserModule } from './user/user.module';
import { ReservationModule } from './reservation/reservation.module';
import { CarModule } from './car/car.module';
import { AuthModule } from './auth/auth.module';
import { BlobModule } from './blob/blob.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ReservationModule,
    CarModule,
    AuthModule,
    BlobModule,
    PaymentsModule,
  ],
})
export class AppModule {}
