import { PaginationDto } from './../common/dto/pagination.dto';
import { Injectable, Logger } from '@nestjs/common';
import { CreatePackageTypeDto } from './dto/create-package-type.dto';
import { UpdatePackageTypeDto } from './dto/update-package-type.dto';
import { handleDbErrors } from 'src/common/helpers/db-error.handler';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageType } from './entities/package-type.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PackageTypesService {
  private logger = new Logger('PackageTypesService')

  constructor(
      @InjectRepository(PackageType)
      private readonly packageTypeRepository: Repository<PackageType>,
      private readonly datasource: DataSource,
  ){}


  async create(createPackageTypeDto: CreatePackageTypeDto) {
    
    try {
      const packageType = this.packageTypeRepository.create(createPackageTypeDto);
      await this.packageTypeRepository.save(packageType);

      const { id, ...data} = packageType;
      return data;
    } catch (error) {
      handleDbErrors(this.logger, error)
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { offset = 0, limit = 10, activeEntries } = paginationDto;
    let condition = (activeEntries == undefined)  ? {}  : { isActive: activeEntries}

    try {
      const packageTypes = await this.packageTypeRepository.find({
        select: {
          sku:false,
          id:true,
          name:true,
          price:true,
          tickets:true,
          discount:true,
          isActive:true,
          createdAt:true,
          since:true, 
          currencyCode:true,
          updatedAt:true
        },
        where:{...condition},
        take:limit,
        skip:offset
      })

      return packageTypes;
    } catch (error) {
      handleDbErrors(this.logger, error)
    }

  }

  async findOne(id: string) {
    try {
      const packageType = await this.packageTypeRepository.findOneBy({ id })
      const { sku, ...data} = packageType;
      return data;
    } catch (error) {
      handleDbErrors(this.logger, error)
    }
  }

  async  update(id: string, updatePackageTypeDto: UpdatePackageTypeDto) {
    try {
      const packageType = await this.packageTypeRepository.preload({id, ...updatePackageTypeDto});
      await this.packageTypeRepository.update({id}, packageType);
      const {sku, ...data } = packageType;
      return data;
    } catch (error) {
      
    }
  }

  async deactivate(id: string) {
    try {
      await this.update(id, {isActive:false})
      return { id, isActive:false }
    } catch (error) {
      handleDbErrors(this.logger, error)
    }
    
  }
}
