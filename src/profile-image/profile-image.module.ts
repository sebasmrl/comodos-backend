import { Module } from '@nestjs/common';
import { ProfileImageService } from './profile-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileImageController } from './profile-image.controller';
import { ProfileImage } from './entities/profile-image.entity';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports:[
    S3Module,
    TypeOrmModule.forFeature([ProfileImage]),
  ],
  controllers: [ProfileImageController],
  providers: [ProfileImageService],
  exports:[TypeOrmModule, ProfileImageService ]
})
export class ProfileImageModule {}
