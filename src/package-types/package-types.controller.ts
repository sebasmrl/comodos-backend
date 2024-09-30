import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackageTypesService } from './package-types.service';
import { CreatePackageTypeDto } from './dto/create-package-type.dto';
import { UpdatePackageTypeDto } from './dto/update-package-type.dto';

@Controller('package-types')
export class PackageTypesController {
  constructor(private readonly packageTypesService: PackageTypesService) {}

  @Post()
  create(@Body() createPackageTypeDto: CreatePackageTypeDto) {
    return this.packageTypesService.create(createPackageTypeDto);
  }

  @Get()
  findAll() {
    return this.packageTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageTypeDto: UpdatePackageTypeDto) {
    return this.packageTypesService.update(id, updatePackageTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageTypesService.remove(id);
  }
}
