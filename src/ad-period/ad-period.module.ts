import { Module } from '@nestjs/common';
import { AdPeriodService } from './ad-period.service';
import { AdPeriodController } from './ad-period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdPeriod } from './entities/ad-period.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([AdPeriod])
  ],
  controllers: [AdPeriodController],
  providers: [AdPeriodService],
  exports:[ TypeOrmModule]
})
export class AdPeriodModule {} 
