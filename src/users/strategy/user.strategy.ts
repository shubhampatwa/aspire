import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { UserRole } from 'src/database/entity/user.entity';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_PRIVATE_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const userQuery = { id: payload.id };
    const user = await this.usersService.findUser(userQuery);

    if (!user || user.role !== UserRole.USER) {
      throw new HttpException(
        { message: 'You are not authorized to perform this request.' },
        401,
      );
    }

    return user;
  }
}
