import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AppConfig } from './config/config';
import { LoanModule } from './loan/loan.module';
import { AdminModule } from './admin/admin.module';
import baseConfig from './config/base.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig, baseConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    PassportModule,
    LoggerModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('base.logger'),
      inject: [ConfigService],
    }),
    UsersModule,
    LoanModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
