import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AdService {

  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>
  ) { }

  async create(createAdDto: CreateAdDto, user: User) {
    const userAddsNumber = await this.adRepository.countBy({ user });
    if (userAddsNumber >= 2) throw new ForbiddenException('Ya cuentas con la cuota maxima de 2 anuncios por persona')

    const ad = this.adRepository.create({ ...createAdDto, user })

    const { user: s, ...result } = await this.adRepository.save(ad);
    return { ...result, user: s.id, userAddsNumber: userAddsNumber + 1 };
  }

  //TODO: Endpoint principal 
  //TODO: Pendiente evaluacion de consulta y estragia (storeProcedure o consulta directa)
  async findAll() {
    return []; 
  }

  async findAllAddsByUserId(id: string) {
    return this.adRepository.findBy({ user: { id } })
  }

  async findOne(id: string) {
    const ad = await this.adRepository.findOneBy({ id });
    if (!ad) throw new NotFoundException(`Anuncio con id: ${id} no encontrado`)
    return ad;
  }

  async update(id: string, updateAdDto: UpdateAdDto) {
    if(Object.keys(updateAdDto).length == 0) 
      throw new BadRequestException('No hay ningun campo a actulizar en el cuerpo de la petición');
    const ad = await this.findOne(id);

    const { renevaldDate, ...data } = updateAdDto;

    console.log({id, renevaldDate, data, ad})

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
    return await this.adRepository.save({...ad, ...data });
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
