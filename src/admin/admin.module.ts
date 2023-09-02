import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Loan } from 'src/database/entity/loan.entity';
import { LoanEwi } from 'src/database/entity/loan-ewi.entity';
import { UsersModule } from 'src/users/users.module';
import { LoanModule } from 'src/loan/loan.module';
import { LoanService } from 'src/loan/loan.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Loan, LoanEwi]),
    UsersModule,
    LoanModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard, LoanService],
})
export class AdminModule {}
