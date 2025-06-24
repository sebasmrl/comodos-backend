import { Module, forwardRef } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { AdImageModule } from 'src/ad-image/ad-image.module';
import { ProfileImageModule } from 'src/profile-image/profile-image.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Ad]),
    forwardRef(()=>AdImageModule),
    UserModule,
    ProfileImageModule
  ],
  controllers: [AdController],
  providers: [AdService],
  exports:[ TypeOrmModule, AdService ]
})
export class AdModule {}
