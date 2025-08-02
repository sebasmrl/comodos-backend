import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { typeOrmConfig } from './typeorm.config';
import { AppController } from './app.controller';
import { CorsMiddleware } from './middleware/cors/cors.middleware';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [typeOrmConfig]
  }),
  /*MulterModule.register({ 
    storage: memoryStorage()
  }), */
  TypeOrmModule.forRootAsync({
    inject: [ConfigService,],
    useFactory: async (configService: ConfigService) => {
      return (configService.get('typeorm.config'))
    }
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
  controllers: [AppController],
  providers: [],
})
export class AppModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('health');
  }
} 




/*
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true, 
    synchronize: false, //true, 
    migrations: [__dirname+'/migrations/*.ts'],
  }), 
 */