import { PaginationDto } from './../common/dto/pagination.dto';
import { Injectable, Logger } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { handleDbErrors } from 'src/common/helpers/db-error.handler';

@Injectable()
export class PackagesService {

  private logger = new Logger('PackagesService')
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>
  ){}

  async create(createPackageDto: CreatePackageDto) {
    //TODO: Se debe verificar de alguna manera el pago

    try {
      const pack = this.packageRepository.create(createPackageDto);
      const packCreated = await this.packageRepository.save(pack);
      return packCreated;
    } catch (error) {
      handleDbErrors(this.logger, error)
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { offset = 0, limit = 10, activeEntries } = paginationDto;
    //let condition = (activeEntries == undefined)  ? {}  : { isActive: activeEntries}

    try {
      const users = await this.packageRepository.find({
        skip: offset,
        take: limit,
        loadRelationIds: { relations:["user"] },
        relations:{
          packageType:true,
        }
      })
      return users;
    } catch (error) {
      handleDbErrors(this.logger, error);
    }
  }
  async findAllByUserId(id:string, paginationDto:PaginationDto) {
    const { offset = 0, limit = 10 } = paginationDto;

    try {
      const packs = await this.packageRepository.find({
        skip: offset,
        take: limit,
        where: {id:id },
        loadRelationIds: { relations:["user"] },
        relations:{
          packageType: true
        }
      })
      return packs;
    } catch (error) {
      handleDbErrors(this.logger, error);
    }
  }

  async findOne(id: string) {
    try {
      const pack = await this.packageRepository.findOne({
        where: { id:id}, 
        loadRelationIds: { relations:["user"] },
        relations:{
          packageType: true
        }
      })
      return pack;
    } catch (error) {
      handleDbErrors(this.logger, error);
    }
  }

 // update(id: number, updatePackageDto: UpdatePackageDto) {
 //   return `This action updates a #${id} package`;
 // }

 // remove(id: number) {
 //   return `This action removes a #${id} package`;
 // }
}
