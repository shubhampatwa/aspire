import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from 'src/database/entity/loan.entity';
import { LoanEwi } from 'src/database/entity/loan-ewi.entity';
import { User } from 'src/database/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Loan, LoanEwi]), UsersModule],
  controllers: [LoanController],
  providers: [LoanService, UsersService, JwtService],
})
export class LoanModule {}
