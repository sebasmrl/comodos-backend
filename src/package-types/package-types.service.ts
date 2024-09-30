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

    return 'This action adds a new packageType';
  }

  findAll() {
    return `This action returns all packageTypes`;
  }

  findOne(id: string) {
    return `This action returns a #${id} packageType`;
  }

  update(id: string, updatePackageTypeDto: UpdatePackageTypeDto) {
    return `This action updates a #${id} packageType`;
  }

  remove(id: string) {
    return `This action removes a #${id} packageType`;
  }
}
