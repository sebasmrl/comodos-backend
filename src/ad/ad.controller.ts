import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe, Query } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/entities/user.entity';
import { AdSearchFilterDto } from './dto/ad-search-filter.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('adds')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Auth()
  @Post()
  async create(@Body() createAdDto: CreateAdDto, @Req() req:Request) {
    const user:User = req['user'];
    return await  this.adService.create(createAdDto, user);
  }

  //*Endpoint principal de filtrado para anuncios
  @Get()
  async findAll(@Query() filter:AdSearchFilterDto) {
    return await  this.adService.findAll(filter);
  }

  @Get('/user/:id')
  findAllByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adService.findAllAddsByUserId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adService.findOne(id);
  }

  @Auth(ValidRoles.USER,  ValidRoles.SUPER_ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAdDto: UpdateAdDto, @Req() req:Request) {
    const user:User =  req['user'];
    return await this.adService.update(id, updateAdDto, user);
  }

  @Auth(ValidRoles.USER, ValidRoles.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string,  @Req() req:Request) {
    const user:User =  req['user'];
    return await this.adService.remove(id, user);
  }
  
}
