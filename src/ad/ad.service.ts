import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AdSearchFilterDto } from './dto/ad-search-filter.dto';

@Injectable()
export class AdService {

  private readonly logger: Logger = new Logger('AdService')
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>
  ) { }

  async create(createAdDto: CreateAdDto, user: User) {
    const userAddsNumber = await this.adRepository.countBy({ user });
    if (userAddsNumber >= 10) throw new ForbiddenException('Ya cuentas con la cuota maxima de 2 anuncios por persona')

    const ad = this.adRepository.create({ ...createAdDto, user })

    const { user: s, ...result } = await this.adRepository.save(ad);
    return { ...result, user: s.id, userAddsNumber: userAddsNumber + 1 };
  }


  //TODO: filtro de tipo de propiedad y periodo de facturacion
  async findAll(filter: AdSearchFilterDto) {
    const { lat, lng, limit = 10, offset = 0, range = 25, minPrice, maxPrice } = filter;

    try {
      let query = this.adRepository.createQueryBuilder('ad')
        .select([
          'ad.id',
          'ad.name',
          'ad.price',
          'ad.coords',
          `(6371 * ACOS(
        COS(RADIANS(:lat)) * COS(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION)) * 
        COS(RADIANS((ad.coords->>'lng')::DOUBLE PRECISION) - RADIANS(:lng)) + 
        SIN(RADIANS(:lat)) * SIN(RADIANS((ad.coords->>'lat')::DOUBLE PRECISION))
      )) AS distance` 
      ]);

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
        .orderBy('distance', 'ASC')
        .addOrderBy('ad.price', 'ASC')
        .limit(limit)
        .offset(offset)
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
    const ad = await this.adRepository.findOneBy({ id });
    if (!ad) throw new NotFoundException(`Anuncio con id: ${id} no encontrado`)
    return ad;
  }

  async update(id: string, updateAdDto: UpdateAdDto) {
    if (Object.keys(updateAdDto).length == 0)
      throw new BadRequestException('No hay ningun campo a actulizar en el cuerpo de la petición');
    const ad = await this.findOne(id);

    const { renevaldDate, ...data } = updateAdDto;

    if (renevaldDate) {
      if (ad.expiredDate > new Date()) {
        return await this.adRepository.save({
          ...ad,
          renevaldDate: new Date(),
          expiredDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
          ...data,
        });
      }
    }
    return await this.adRepository.save({ ...ad, ...data });
  }

  async remove(id: string) {
    await this.findOne(id);
    //TODO: Añadir logica para eliminar las imagenes del servicio de cloudStorage

    try {
      await this.adRepository.delete({ id: id })
      return true;
    } catch (e) {
      throw new InternalServerErrorException(`Ocurrió un errror inesperado, el anuncio con id: ${id} no se pudo eliminar`)
    }


  }
}
