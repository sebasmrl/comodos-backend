import { PaginationDto } from './../common/dto/pagination.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

//Compras de paquetes
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  //TODO: Solo Admin
  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.packagesService.findAll(paginationDto);
  }

  //TODO:Solo usuario auth y admin
  @Get('user')
  findAllByUserId(@Query() paginationDto:PaginationDto) {
    return this.packagesService.findAll(paginationDto);
  }

  //TODO: publico
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.packagesService.findOne(id);
  }

//  @Patch(':id')
//  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
//    return this.packagesService.update(+id, updatePackageDto);
//  }

//  @Delete(':id')
//  remove(@Param('id') id: string) {
//    return this.packagesService.remove(+id);
//  }
}
