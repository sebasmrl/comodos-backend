import { PaginationDto } from './../common/dto/pagination.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
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
  findAll(@Query() paginationDto:PaginationDto) {
    return this.packageTypesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.packageTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePackageTypeDto: UpdatePackageTypeDto) {
    return this.packageTypesService.update(id, updatePackageTypeDto);
  }

  @Delete(':id')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.packageTypesService.deactivate(id);
  }
}
