import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { LoanEwi } from 'src/database/entity/loan-ewi.entity';
import { Loan, LoanStatus } from 'src/database/entity/loan.entity';
import { LoanService } from 'src/loan/loan.service';
import { getNextWeekDate } from 'src/utils/helper';
import { DataSource, Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource() private connection: DataSource,
    @InjectRepository(Loan) private loanRepository: Repository<Loan>,
    @InjectRepository(LoanEwi) private loanEwiRepository: Repository<LoanEwi>,
    private loanService: LoanService,
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return this.loanRepository
      .createQueryBuilder('meeting')
      .where('"approval" = :status', { status: LoanStatus.PENDING })
      .getMany();
  }

  findOne(id: string) {
    return this.loanService.findLoan({ id }, []);
  }

  async update(id: string) {
    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      const loan = await this.findOne(id);
      loan.approval = LoanStatus.APPROVED;
      await QueryRunner.manager.update(Loan, id, loan);
      const loanEwi = [];
      const installment = loan.amount / loan.terms;
      for (let i = 1; i <= loan.terms; i++) {
        loanEwi.push(
          this.loanEwiRepository.create({
            loan,
            term: i,
            dueOn: getNextWeekDate(loan.createdOn, i),
            weeklyInstallment: installment,
          }),
        );
      }
      await QueryRunner.manager.save(loanEwi);
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      return loan;
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
      throw new Error(err);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
