import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropertyTypeService } from './property-type.service';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('property-types')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  @Auth( ValidRoles.SUPER_ADMIN)
  @Post()
  create(@Body() createPropertyTypeDto: CreatePropertyTypeDto) {
    return this.propertyTypeService.create(createPropertyTypeDto);
  }

  @Get()
  findAll() {
    return this.propertyTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyTypeService.findOne(id);
  }

  @Auth( ValidRoles.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyTypeDto: UpdatePropertyTypeDto) {
    return this.propertyTypeService.update(id, updatePropertyTypeDto);
  }

  @Auth( ValidRoles.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyTypeService.remove(id);
  }
}
