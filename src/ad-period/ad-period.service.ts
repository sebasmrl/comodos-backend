import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdPeriodDto } from './dto/create-ad-period.dto';
import { UpdateAdPeriodDto } from './dto/update-ad-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdPeriod } from './entities/ad-period.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdPeriodService {

  constructor(
    @InjectRepository(AdPeriod)
    private readonly adPeriodRepository: Repository<AdPeriod>
  ){}

  async create(createAdPeriodDto: CreateAdPeriodDto) {
    const adPeriod = this.adPeriodRepository.create(createAdPeriodDto);
    const newAdPeriod = await this.adPeriodRepository.save(adPeriod);
    return newAdPeriod;
  }

  async findAll() {
    return await this.adPeriodRepository.find();
  }

  async findOne(id: string) {
    const adPeriod = await this.adPeriodRepository.findOneBy({id})
    if(!adPeriod)  throw new NotFoundException(`Periodo con id: ${id} no encontrado`)
    return adPeriod;
  }

 async  update(id: string, updateAdPeriodDto: UpdateAdPeriodDto) {
    if(Object.keys(updateAdPeriodDto).length == 0) throw new BadRequestException('No hay datos para actualizar en el cuerpo de la petición')
    const adPeriod = await this.findOne(id);
    const updatedAdPeriod = await this.adPeriodRepository.save({...adPeriod, ...updateAdPeriodDto});
    return updatedAdPeriod;
  }

  async remove(id: string) {
    await this.findOne(id)
    const  data = await this.adPeriodRepository.delete({id})
    if(!data.affected) throw new InternalServerErrorException(`Ocurrió un error inesperado, el periodo con id: ${id} no fue posible eliminarlo`) 
    return true;
  }
}
