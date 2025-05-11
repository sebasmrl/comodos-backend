import { Module } from '@nestjs/common';
import { SesService } from './ses.service';
import { SesController } from './ses.controller';

@Module({
  controllers: [SesController],
  providers: [SesService],
})
export class SesModule {}
