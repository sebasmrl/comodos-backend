import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AdPeriodService } from './ad-period.service';
import { CreateAdPeriodDto } from './dto/create-ad-period.dto';
import { UpdateAdPeriodDto } from './dto/update-ad-period.dto';

@Controller('ad-periods')
export class AdPeriodController {
  constructor(private readonly adPeriodService: AdPeriodService) {}

  @Post()
  async create(@Body() createAdPeriodDto: CreateAdPeriodDto) {
    return await this.adPeriodService.create(createAdPeriodDto);
  }

  @Get()
  async findAll() {
    return await this.adPeriodService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.adPeriodService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAdPeriodDto: UpdateAdPeriodDto) {
    return await this.adPeriodService.update(id, updateAdPeriodDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.adPeriodService.remove(id);
  }
}
