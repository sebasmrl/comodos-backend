import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";
import { typeOrmConfig } from "./typeorm.config";

 dotenvConfig({
    path: '.env',
})

export default new DataSource(typeOrmConfig() as DataSourceOptions);