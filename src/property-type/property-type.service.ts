import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { PropertyType } from './entities/property-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PropertyTypeService {
  
  
    constructor(
      @InjectRepository(PropertyType)
      private readonly propertyTypeRepository: Repository<PropertyType>
    ){}
  
    async create(createPropertyTypeDto: CreatePropertyTypeDto) {
      const PropertyType = this.propertyTypeRepository.create(createPropertyTypeDto);
      const newPropertyType = await this.propertyTypeRepository.save(PropertyType);
      return newPropertyType;
    }
  
    async findAll() {
      return await this.propertyTypeRepository.find();
    }
  
    async findOne(id: string) {
      const propertyType = await this.propertyTypeRepository.findOneBy({id})
      if(!propertyType)  throw new NotFoundException(`Tipo de propiedad con id: ${id} no encontrado`)
      return propertyType;
    }   
  
   async  update(id: string, updatePropertyTypeDto: UpdatePropertyTypeDto) {
      if(Object.keys(updatePropertyTypeDto).length == 0) throw new BadRequestException('No hay datos para actualizar en el cuerpo de la petición')
      const propertyType = await this.findOne(id);
      const updatedPropertyType = await this.propertyTypeRepository.save({...propertyType, ...updatePropertyTypeDto});
      return updatedPropertyType;
    }
  
    async remove(id: string) {
      await this.findOne(id)
      const  data = await this.propertyTypeRepository.delete({id})
      if(!data.affected) throw new InternalServerErrorException(`Ocurrió un error inesperado, el tipo de propiedad con id: ${id} no fue posible eliminarlo`) 
      return true;
    }
}
