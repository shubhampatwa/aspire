import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { User } from 'src/database/entity/user.entity';
import { AppConfig } from 'src/config/config';
import { UserAuthGuard } from './guards/user-auth.guard';
import { UserStrategy } from './strategy/user.strategy';
import { AdminGuard } from './guards/admin.guard';
import { AdminStrategy } from './strategy/admin.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    LocalStrategy,
    UserStrategy,
    JwtService,
    PassportModule,
    UserAuthGuard,
    AdminStrategy,
    AdminGuard,
  ],
})
export class UsersModule {}
