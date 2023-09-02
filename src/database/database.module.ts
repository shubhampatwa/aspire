import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { AppConfig } from '../config/config';

const CONFIG = AppConfig();

const defaultTypeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  migrationsRun: CONFIG.ORM_AUTO_MIGRATION,
  logging: CONFIG.ORM_LOGGING_ENABLED,
  dropSchema: false,
  synchronize: true,
  autoLoadEntities: true,
  url: CONFIG.POSTGRES_URL,
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  entities: [
    join(__dirname, '..', '/**/*.entity{.ts,.js}'),
    join(__dirname, '..', '/**/*.view-entity{.ts,.js}'),
  ],
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultTypeOrmModuleOptions,
      name: 'default',
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
