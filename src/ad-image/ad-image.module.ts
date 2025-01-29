import { Module } from '@nestjs/common';
import { AdImageService } from './ad-image.service';
import { AdImageController } from './ad-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdImage } from './entities/ad-image.entity';
import { AdModule } from 'src/ad/ad.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports:[
    AdModule,
    TypeOrmModule.forFeature([AdImage]),
    S3Module
  ],
  controllers: [AdImageController],
  providers: [AdImageService],
  exports:[ TypeOrmModule ]
})
export class AdImageModule {}
