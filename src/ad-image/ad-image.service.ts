import { AdService } from './../ad/ad.service';
import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AdImage } from './entities/ad-image.entity';
import { Repository } from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import { S3Service } from 'src/s3/s3.service';


@Injectable()
export class AdImageService {

  constructor(
    @InjectRepository(AdImage)
    private readonly adImageRepository: Repository<AdImage>,
    private readonly adService: AdService,
    private readonly s3Service: S3Service
  ) { }

  async findOne(id: string) {
    const profileImage = await this.adImageRepository.findOneBy({ id });
    if (!profileImage) throw new NotFoundException(`Imagen con id:${id} no encontrada`)
    return profileImage;
  }

  //Obtine solo la imagen principal segun su id
  async findMainAdImage(id: string) {
    const profileImage = await this.adImageRepository.findOneBy({ id, fieldName: 'main' });
    if (!profileImage) throw new NotFoundException(`Imagen con id:${id} no encontrada`)
    return profileImage;
  }

  async findAllAdImagesByAdIdWithVerification(adId: string, user: User) {
    await this.adService.verifyAdsIsUserProperty({ ids: [adId], user });
    return await this.adImageRepository.find({ where: { ad: { id: adId } } })
  }

  public async findAllAdImagesByAdId(adId: string) {
    return await this.adImageRepository.find({
      where: {
        ad: { id: adId },
      },
      relations: {
        ad: true
      }
    });
  }


  async createOrUpdate(files: Express.Multer.File[], adId: string, user: User) {
    await this.adService.verifyAdsIsUserProperty({ ids: [adId], user });

    // Imagenes de un anuncio guardadas con anterioridad
    const adImagesSaved = await this.findAllAdImagesByAdId(adId);

    //Filtrado para identificar que imagenes vienen en los campos y si hay alguna img que viene pero no esta guardada
    const imagesToUpdate: {
      adImageModel: AdImage;
      file: Express.Multer.File;
    }[] = files.map(file => {

      const found = adImagesSaved.filter(adImage => adImage.fieldName == file.fieldname)[0];
      return (found)
        ? {
          adImageModel: this.adImageRepository.create({     //update
            ...found,
            ad: { id: found.ad.id },
            fieldName: file.fieldname
          }), file: file
        }
        : {
          adImageModel: this.adImageRepository.create({    //create
            ad: { id: adId },
            key: uuidv5(`${file.fieldname}.${adId}.${user.id}`, user.id),
            fieldName: file.fieldname
          }), file: file
        };
    });



    /* //Filtrado para identificar las entidades que no vienen y deben eliminarse 
      *Comentado para no incurrir en operaciones de escritura redundantes en DB y S3
      const imagesToDelete = adImagesSaved.filter(img => {
        return (imagesToUpdate.filter(img2 => img.id == img2.adImageModel.id).length > 0)
        ? false : true;
      }) 
        //TODO: Eliminar las entidades de los cmapos que no vienen
        const imageFilesDeleted = await this.adImageRepository.remove(imagesToDelete);
      */


    const imageFilesUpdated = await this.adImageRepository.save(imagesToUpdate.map(img => img.adImageModel));
    await Promise.all(
      imagesToUpdate.map((img => {
        const promise = async () => {
          return await this.s3Service.uploadFile(img.file, img.adImageModel.key)
        }
        return promise();
      }))
    )

    return ({ updatedImages: imageFilesUpdated });
  }




  async removeOne(id: string, user: User) {
    await this.adService.verifyAdsIsUserProperty({ ids: [id], user });
    const adImage = await this.findOne(id);

    try {
      const { affected } = await this.adImageRepository.delete(adImage)
      await this.s3Service.deleteFile(adImage.key);

      if (affected > 0) return true;
    } catch (e) {
      throw new InternalServerErrorException(`Ocurrio un error inesperado, no se pudo eliminar imagen de anuncio con id: ${id}`)
    }

  }


  async removeAllAdImagesByAdId(adId: string, user: User) {

    await this.adService.verifyAdsIsUserProperty({
      ids: [adId],
      user
    })

    const adImages = await this.findAllAdImagesByAdId(adId);

    const rs = await this.removeManyAdImageFiles(
      adImages.map(adImage => adImage.key)
    );
    return rs;
  }

  
  async removeManyAdImageFiles(fileKeys: string[]) {
    try {
      const rs = await this.s3Service.deleteFiles({ fileKeys });
      return rs;
    } catch (e) {
      return false;
    }
  }


}
