import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { LessThan, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AdSearchFilterDto } from './dto/ad-search-filter.dto';
import { AdPeriod } from 'src/ad-period/entities/ad-period.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdService {

  private readonly logger: Logger = new Logger('AdService')
  constructor(
    @Inject()
    private readonly configService: ConfigService,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>
  ) { }

  async create(createAdDto: CreateAdDto, user: User) {

    const isValid = await this.isValidRenevalAdBySuscription(user)
    if(!isValid.value) throw new ForbiddenException(`Ya cuentas con la cuota maxima de ${isValid.allowedAds} anuncios por persona`)
    const ad = this.adRepository.create({ ...createAdDto, user })

    const { user: s, ...result } = await this.adRepository.save(ad);
    return { ...result, user: s.id, userAddsNumber: isValid.activeAds };
  }


  async findAll(filter: AdSearchFilterDto) {
    const { lat, lng, limit = 10, offset = 0, range = 25, minPrice, maxPrice, propertyType, period } = filter;

    try {
      let query = this.adRepository.createQueryBuilder('ad')
        //.leftJoinAndSelect('ad.images', 'images')
        .innerJoinAndSelect('ad.period', 'p')
        .leftJoinAndSelect('ad.propertyType', 'pt')
        .select([
          'ad.id AS id',
          'ad.name AS name',
          'ad.price AS price',
          'ad.locationCity AS location_city',
          'ad.address AS address',
          'ad.currency AS currency',
          'ad.rooms AS rooms',
          'ad.bathrooms AS bathrooms',
          'ad.squareMeters AS square_meters',
          'ad.furnished as furnished',
          'ad.coords AS coords',
          'ad.updatedAt AS updated_at',
          //'images',
          'p.name AS period',
          'pt.name AS property_type',
          `(6371 * ACOS(
        COS(RADIANS(:lat)) * COS(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION)) * 
        COS(RADIANS((ad.coords->>'lng')::DOUBLE PRECISION) - RADIANS(:lng)) + 
        SIN(RADIANS(:lat)) * SIN(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION))
      )) AS distance`
        ])


      if (minPrice !== undefined) { query.andWhere('ad.price >= :minPrice', { minPrice: minPrice }); }
      if (maxPrice !== undefined) { query.andWhere('ad.price <= :maxPrice', { maxPrice: maxPrice }); }
      if (propertyType !== undefined) { query.andWhere('pt.name = :propertyType', { propertyType: propertyType }) }
      if (period !== undefined) { query.andWhere('p.name = :period', { period: period }) }

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
        .orderBy('distance', 'ASC')
        .addOrderBy('ad.price', 'ASC')
        .limit(limit)
        .offset(offset)
        .getRawMany()

    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException(error);
    }
  }

  async findAllAdsByUserId(id: string) {
    return await this.adRepository.findBy({ user: { id } })
  }

  async findAllAdIdsByUserId(id: string) {
    return await this.adRepository.find({
      where: { user: { id } },
      select: { id: true }
    })
  }


  async findOne(id: string) {
    const ad = await this.adRepository.findOne({ where: { id }, relations:{ user:true} });
    if (!ad) throw new NotFoundException(`Anuncio con id: ${id} no encontrado`)
    return ad;
  }

  async findOneComplete(id: string) {
    const ad = await this.adRepository.findOne({
      where: { id },
      //loadRelationIds: { relations: ['user'] },
      relations: {
        propertyType: true,
        period: true,
        images: true,
        user: true
      }
    });
    if (!ad) throw new NotFoundException(`Anuncio con id: ${id} no encontrado`)

    return ad;
  }

  async update(id: string, updateAdDto: UpdateAdDto, user: User) {
    if (Object.keys(updateAdDto).length == 0)
      throw new BadRequestException('No hay ningun campo a actualizar en el cuerpo de la petición');

    const ad = await this.findOne(id);
    this.verifyAdUserPropertyOrUserHasValidRole(ad, user);

    const { ...data } = updateAdDto;
    return await this.adRepository.save({ ...ad, ...data, updatedAt: new Date() });
  }



  async renewalOneAd(id: string, user: User) {
    const ad = await this.findOne(id);
    this.verifyAdUserPropertyOrUserHasValidRole(ad, user);

    const now = new Date();
    if (ad.expiredDate.getTime() < now.getTime()) {

      const canRenevalAd = await this.isValidRenevalAdBySuscription(ad.user);
      if (!canRenevalAd.value) return false;

      await this.adRepository.save({
        ...ad,
        renewalDate: new Date(),
        expiredDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      });
      return true;
    }
    return false;
  }




  async remove(id: string, user: User) {
    const ad = await this.findOne(id);
    this.verifyAdUserPropertyOrUserHasValidRole(ad, user);

    try {
      await this.adRepository.delete({ id: id })
      return true;
    } catch (e) {
      throw new InternalServerErrorException(`Ocurrió un error inesperado, el anuncio con id: ${id} no se pudo eliminar`)
    }
  }

  private verifyAdUserPropertyOrUserHasValidRole(ad: Ad, user: User) {
    if (ad.user.id != user.id) {
      if(!user.roles.includes('SUPER_ADMIN')){
        throw new ForbiddenException(`Lo sentimos ${user.names}, pero no tienes acceso a este recurso`);
      }
    }
    return;
  }


  async isValidRenevalAdBySuscription(user: User) {
    const now = new Date();
    const isAdminRole = user.roles.includes('SUPER_ADMIN');
    const allowedAds = Number(this.configService.get('COMODOS_FREE_ADS')) ?? 1;
    const activeAds = (await this.findAllAdsByUserId(user.id)).filter(ad => ad.expiredDate > now).length
    
    //todo: pendiente a cambio con suscripciones en user.isRealStateCompany
    return ((activeAds <= allowedAds) || isAdminRole || user.isRealStateCompany) 
      ? {value: true, allowedAds, activeAds}
      : {value: false, allowedAds, activeAds}
  }

  async adsByUserAllowed(user: User) {
    const userAdsNumber = await this.adRepository.countBy({ user });
    if (userAdsNumber >= 5) throw new ForbiddenException('Ya cuentas con la cuota maxima de 5 anuncios por persona')
    return userAdsNumber;
  }



  async verifyAdsIsUserProperty({ ids, user }: { ids: string[], user: User }): Promise<boolean> {
    const adIds = (await this.findAllAdIdsByUserId(user.id)).map(ad => ad.id); //ids de anuncios del usuario

    if (adIds.length > 0) {
      ids.forEach(adId => {
        if (!adIds.includes(adId)) throw new ForbiddenException('No tienes acceso a la modificacion de los recursos especificados');
      })
    } else {
      throw new BadRequestException('Recursos inexistentes');
    }
    return true;
  }
}
