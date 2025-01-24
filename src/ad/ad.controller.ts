import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('adds')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Auth()
  @Post()
  create(@Body() createAdDto: CreateAdDto, @Req() req:Request) {
    const user:User = req['user'];
    return this.adService.create(createAdDto, user);
  }

  @Get()
  async findAll() {
    return await  this.adService.findAll();
  }

  @Get('/user/:id')
  findAllByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adService.findAllAddsByUserId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAdDto: UpdateAdDto) {
    return await this.adService.update(id, updateAdDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adService.remove(id);
  }
}
