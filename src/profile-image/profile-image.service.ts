import { Injectable, InternalServerErrorException, NotFoundException, Res, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileImage } from './entities/profile-image.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ProfileImageService {

  private readonly logger = new Logger('ProfileImageService');
  constructor(
    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>,
    private readonly s3Service: S3Service
  ) { }


  async createOrUpdate(file: Express.Multer.File, user: User) {
   
    const fileType = file.mimetype.split('/')[1];
    let url: string;

    if (user.profileImage) {
      const { affected } = await this.profileImageRepository.update({ id: user.profileImage.id }, { key: `${user.profileImage.id}.${fileType}` });
      if (affected > 0) {
        url = await this.s3Service.uploadFile(file, `${user.profileImage.id}.${fileType}`);
        return {
          id: user.profileImage.id,
          key: `${user.profileImage.id}.${fileType}`,
          url: url
        }
      }
    } else {
      const userImage = this.profileImageRepository.create({ user: user });
      url = await this.s3Service.uploadFile(file, `${userImage.id}.${fileType}`);
      userImage.key = `${userImage.id}.${fileType}`;

      const { user: userFromImg, ...result } = await this.profileImageRepository.save(userImage);
      return { ...result, url };
    }

  }


  async findOneProfileImageFromDB(id: string,): Promise<ProfileImage> {
    const profileImage = await this.profileImageRepository.findOneBy({ id });
    if (!profileImage) throw new NotFoundException(`Imagen con id:${id} no encontrada`)
    return profileImage;
  }


  async findOneProfileImageUrl(id: string,): Promise<string> {
    const profileImage = await this.findOneProfileImageFromDB(id);
    return await this.s3Service.getFile(profileImage.key)
  }


  async remove(id: string, user: User) {
    const profileImage = await this.findOneProfileImageFromDB(id);
    if (profileImage.id != user.profileImage.id) throw new ForbiddenException('No tienes acceso a la modificación de este recurso')
    try {
      const { affected } = await this.profileImageRepository.update({ id: profileImage.id }, { key: null })
      const deletedfromS3 = await this.s3Service.deleteFile(id);
      if (affected > 0 && deletedfromS3) return true;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(`Ocurrió un error inesperado, no se pudo actualizar la imagen con id: ${id}`)
    }
  }


}
