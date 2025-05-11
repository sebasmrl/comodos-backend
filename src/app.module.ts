import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ProfileImageModule } from './profile-image/profile-image.module';
import { AdModule } from './ad/ad.module';
import { AdPeriodModule } from './ad-period/ad-period.module';
import { PropertyTypeModule } from './property-type/property-type.module';
import { AdImageModule } from './ad-image/ad-image.module';
import { S3Module } from './s3/s3.module';
import { SesModule } from './ses/ses.module';

@Module({
  imports: [ConfigModule.forRoot(), 
    /*MulterModule.register({ 
      storage: memoryStorage()
    }), */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, 
      synchronize:true, 
    }),
    UserModule,
    CommonModule,
    AuthModule,
    ProfileImageModule,
    AdModule,
    AdPeriodModule,
    PropertyTypeModule,
    AdImageModule,
    S3Module,
    SesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
