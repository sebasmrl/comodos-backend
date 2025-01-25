import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AdImage } from './entities/ad-image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdImageService {
  
  constructor(
      @InjectRepository(AdImage)
      private readonly adImageRepository: Repository<AdImage>
    ) { }
  
    async findOne(id: string) {
      const profileImage =  await this.adImageRepository.findOneBy({ id });
      if(!profileImage) throw new NotFoundException(`Imagen con id:${id} no encontrada`)
      return profileImage;
    }

    async findMainAdImage(id: string) {
      const profileImage =  await this.adImageRepository.findOneBy({ id, fieldName:'main'});
      if(!profileImage) throw new NotFoundException(`Imagen con id:${id} no encontrada`)
      return profileImage;
    }
  
    async createOrUpdate(files: Express.Multer.File[], user:User ) { // user: User
      //TODO: Añadir logica de subir imagen y/o actualizar a/en algun CloudStorage y guardar en lugar de file.originalName la url del proveedor
  
      console.log({files})
    /*   if (user.profileImage) {
        const { affected } = await this.adImageRepository.update({ id: user.profileImage.id }, { url: file.originalname });
        if (affected > 0) return {
          id: user.profileImage.id,
          url: file.originalname
        }
      } else {
        const userImage = this.adImageRepository.create({ user: user, url: file.originalname });
        const { user: userFromImg, ...result } = await this.adImageRepository.save(userImage);
        return result;
      } */
      return true;
    }

    
    async remove(id: string, user:User) {

      //TODO: Validar que el usuario se el dueño del anuncio
      //TODO: Realizar logica de eliminación de archivo en el CloudStorage

      const adImage = await this.findOne(id);
      try{
        const { affected}=  await this.adImageRepository.delete({id:adImage.id})
         if(affected>0) return true;
      }catch(e){
        throw new InternalServerErrorException(`Ocurrio un error inesperado, no se pudo eliminar imagen de anuncio con id: ${id}`)
      }
    }
}
