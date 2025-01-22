import { Module } from '@nestjs/common';
import { ProfileImageService } from './profile-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileImageController } from './profile-image.controller';
import { ProfileImage } from './entities/profile-image.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ProfileImage]),
  ],
  controllers: [ProfileImageController],
  providers: [ProfileImageService],
  exports:[TypeOrmModule, ]
})
export class ProfileImageModule {}
