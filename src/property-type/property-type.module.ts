import { Module } from '@nestjs/common';
import { PropertyTypeService } from './property-type.service';
import { PropertyTypeController } from './property-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyType } from './entities/property-type.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PropertyType])
  ],
  controllers: [PropertyTypeController],
  providers: [PropertyTypeService],
  exports: [TypeOrmModule]
})
export class PropertyTypeModule {}
