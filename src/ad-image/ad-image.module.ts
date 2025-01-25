import { Module } from '@nestjs/common';
import { AdImageService } from './ad-image.service';
import { AdImageController } from './ad-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdImage } from './entities/ad-image.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([AdImage])
  ],
  controllers: [AdImageController],
  providers: [AdImageService],
  exports:[ TypeOrmModule ]
})
export class AdImageModule {}
