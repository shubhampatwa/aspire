import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserReq } from './user.interface';
import { ResponseObj } from 'src/utils/interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const accessToken = this.usersService.createAuthJwt({ id: user.id });
    return { http: 201, result: { ...user, accessToken } };
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: UserReq): Promise<ResponseObj> {
    const result = { ...req.user.toJSON(), accessToken: null };
    result.accessToken = this.usersService.createAuthJwt({ id: req.user.id });
    return { result };
  }
}
