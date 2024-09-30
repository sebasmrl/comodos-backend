import { Module } from '@nestjs/common';
import { PackageTypesService } from './package-types.service';
import { PackageTypesController } from './package-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageType } from './entities/package-type.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      PackageType
    ])
  ],
  controllers: [PackageTypesController],
  providers: [PackageTypesService],
})
export class PackageTypesModule {}
