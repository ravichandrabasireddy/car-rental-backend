import { Module } from '@nestjs/common';
import { BlobService } from './blob.service';
import { BlobController } from './blob.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [BlobService, JwtService],
  controllers: [BlobController ]
})
export class BlobModule {}
