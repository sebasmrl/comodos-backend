import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileImage } from './entities/profile-image.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProfileImageService {
  constructor(
    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>
  ) { }


  async createOrUpdate(file: Express.Multer.File, user: User) {
    //TODO: Añadir logica de subir imagen y/o actualizar a/en algun CloudStorare y guardar en lugar de file.originalName la url del proveedor

    if (user.profileImage) {
      const { affected } = await this.profileImageRepository.update({ id: user.profileImage.id }, { url: file.originalname });
      if (affected > 0) return {
        id: user.profileImage.id,
        url: file.originalname
      }
    } else {
      const userImage = this.profileImageRepository.create({ user: user, url: file.originalname });
      const { user: userFromImg, ...result } = await this.profileImageRepository.save(userImage);
      return result;
    }

  }

  async findOne(id: string) {
    const profileImage =  await this.profileImageRepository.findOneBy({ id });
    if(!profileImage) throw new NotFoundException(`Imagen con id:${id} no encontrada`)
    return profileImage;
  }


  async remove(id: string) {
    //TODO: Validar que el usuario sea  el propietario
    //TODO: realizar logica para eliminar imagen en el CloudStorage
    const profileImage = await this.findOne(id);
    try{
      const { affected}=  await this.profileImageRepository.update({id:profileImage.id},{ url:null})
       if(affected>0) return true;
    }catch(e){
      throw new InternalServerErrorException(`Ocurrió un error inesperado, no se pudo actualizar la imagen con id: ${id}`)
    }
  }
}
