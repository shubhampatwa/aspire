import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User, UserRole } from 'src/database/entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AppConst } from 'src/config/constants';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectDataSource() private connection: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.seedAdmin();
  }

  async create(createUserDto: CreateUserDto) {
    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      const user = this.userRepository.create(createUserDto);
      await QueryRunner.manager.save(user);
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      return user;
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
      throw new Error(err);
    }
  }

  async findUser(
    where: Record<string, any>,
    relations = ['loan'],
  ): Promise<User> {
    return this.userRepository.findOne({
      where,
      relations: relations,
    });
  }

  findOne(name: string) {
    return this.findUser({ name });
  }

  createAuthJwt(payload: any): string {
    return this.jwtToken(payload, AppConst.authJwtExpiry);
  }

  jwtToken(payload: any, expiresIn: number = null): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_PRIVATE_KEY'),
      issuer: this.configService.get('JWT_ISSUER'),
      expiresIn: expiresIn || this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  async seedAdmin() {
    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      const user = this.userRepository.create({
        name: 'shubham',
        email: 'shubhampatwa526@gmail.com',
        role: UserRole.ADMIN,
      });

      await QueryRunner.manager.save(user);
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      this.logger.info('Admin seeded successfully');
      return user;
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
    }
  }
}
