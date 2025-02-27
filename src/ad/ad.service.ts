import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { LessThan, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AdSearchFilterDto } from './dto/ad-search-filter.dto';
import { AdPeriod } from 'src/ad-period/entities/ad-period.entity';

@Injectable()
export class AdService {

  private readonly logger: Logger = new Logger('AdService')
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>
  ) { }

  async create(createAdDto: CreateAdDto, user: User) {
    const userAddsNumber = await this.adRepository.countBy({ user });
    if (userAddsNumber >= 5) throw new ForbiddenException('Ya cuentas con la cuota maxima de 5 anuncios por persona')

    const ad = this.adRepository.create({ ...createAdDto, user })

    const { user: s, ...result } = await this.adRepository.save(ad);
    return { ...result, user: s.id, userAddsNumber: userAddsNumber + 1 };
  }


  //TODO: filtro de tipo de propiedad y periodo de facturacion
  async findAll(filter: AdSearchFilterDto) {
    const { lat, lng, limit = 10, offset = 0, range = 25, minPrice, maxPrice } = filter;

    try {
      let query = this.adRepository.createQueryBuilder('ad')
        .innerJoinAndSelect('ad.period', 'p')
        .innerJoinAndSelect('ad.propertyType', 'pt')
        .select([
          'ad.id',
          'ad.name',
          'ad.price',
          'ad.location_city as ad_location_city',
          'ad.address',
          'ad.currency',
          'ad.rooms',
          'ad.bathrooms',
          'ad.square_meters as ad_square_meters',
          'ad.furnished',
          'ad.coords',
          'p.name as ad_period',
          'pt.name as ad_property_type',
          `(6371 * ACOS(
        COS(RADIANS(:lat)) * COS(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION)) * 
        COS(RADIANS((ad.coords->>'lng')::DOUBLE PRECISION) - RADIANS(:lng)) + 
        SIN(RADIANS(:lat)) * SIN(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION))
      )) AS ad_distance` 
      ])

      if ( minPrice !== undefined) {   query.andWhere('ad.price >= :minPrice', { minPrice: minPrice });  }
      if ( maxPrice !== undefined) {   query.andWhere('ad.price <= :maxPrice', { maxPrice: maxPrice }); } 

      return await query.andWhere(`(6371 * ACOS(
        COS(RADIANS(:lat)) * COS(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION)) * 
        COS(RADIANS((ad.coords->>'lng')::DOUBLE PRECISION) - RADIANS(:lng)) + 
        SIN(RADIANS(:lat)) * SIN(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION))
      )) < :range`, { range: range })
        .andWhere({
          'expiredDate': MoreThan(new Date())
        })
        .setParameter('lng', lng)
        .setParameter('lat', lat)
        .orderBy('ad_distance', 'ASC')
        .addOrderBy('ad.price', 'ASC')
        .limit(limit)
        .getRawMany();

    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException(error);
    }
  }

  async findAllAddsByUserId(id: string) {
    return await this.adRepository.findBy({ user: { id } })
  }

  async findAllAdIdsByUserId(id: string) {
    return await this.adRepository.find({
      where:{  user: { id }  },
      select:{ id:true}
    })
  }

  
  async findOne(id: string) {
    const ad = await this.adRepository.findOne({ where:{id}, loadRelationIds:{ relations: ['user']}});
    if (!ad) throw new NotFoundException(`Anuncio con id: ${id} no encontrado`)
    return ad;
  }


  async update(id: string, updateAdDto: UpdateAdDto, user:User) {
    if (Object.keys(updateAdDto).length == 0)
      throw new BadRequestException('No hay ningun campo a actulizar en el cuerpo de la petición');

    const ad = await this.findOne(id);
    this.verifyAdUserPropertyOrUserHasValidRole(ad, user);
    
    const { renevaldDate, ...data } = updateAdDto;

    if (renevaldDate) {
      if (ad.expiredDate < new Date()) {
        return await this.adRepository.save({
          ...ad,
          ...data,
          renevaldDate: new Date(),
          expiredDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        });
      }
    }
    return await this.adRepository.save({ ...ad, ...data });
  }

  async remove(id: string, user:User) {
    const ad = await this.findOne(id);
    this.verifyAdUserPropertyOrUserHasValidRole(ad, user);

    try {
      await this.adRepository.delete({ id: id })
      return true;
    } catch (e) {
      throw new InternalServerErrorException(`Ocurrió un errror inesperado, el anuncio con id: ${id} no se pudo eliminar`)
    }
  }

  private verifyAdUserPropertyOrUserHasValidRole(ad:Ad, user:User){
    if((String(ad.user) != user.id) || !user.roles.includes('SUPER_ADMIN')) 
      throw new ForbiddenException(`Lo sentimos ${user.names}, pero no tienes acceso a este recurso`);
  }
}
