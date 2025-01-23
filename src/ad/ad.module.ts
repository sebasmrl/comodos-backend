import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Ad])
  ],
  controllers: [AdController],
  providers: [AdService],
  exports:[ TypeOrmModule ]
})
export class AdModule {}
