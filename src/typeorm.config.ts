import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AdImage } from "src/ad-image/entities/ad-image.entity";
import { AdPeriod } from "src/ad-period/entities/ad-period.entity";
import { Ad } from "src/ad/entities/ad.entity";
import { ProfileImage } from "src/profile-image/entities/profile-image.entity";
import { PropertyType } from "src/property-type/entities/property-type.entity";
import { User } from "src/user/entities/user.entity";



export const typeOrmConfig = registerAs(
    'typeorm.config',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        entities: [User, Ad, AdImage, ProfileImage, PropertyType, AdPeriod],
        //entities: ['./src/*/entities/*.entity.ts'],
        migrations: ['migrations/*{.ts,.js}'],
        synchronize: false,
        logging: true,
    })
);


//npm run typeorm migration:generate ./migrations/firstMigration -- -d typeorm.config.ts