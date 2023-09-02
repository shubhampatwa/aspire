import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { LoanEwi, LoanPaid } from 'src/database/entity/loan-ewi.entity';
import { Loan, LoanStatus } from 'src/database/entity/loan.entity';
import { User } from 'src/database/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectDataSource() private connection: DataSource,
    @InjectRepository(Loan) private loanRepository: Repository<Loan>,
    @InjectRepository(LoanEwi) private loanEwiRepository: Repository<LoanEwi>,
  ) {}

  async create(createLoanDto: CreateLoanDto, user: User) {
    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      const loan = this.loanRepository.create(createLoanDto);
      loan.user = user;
      await QueryRunner.manager.save(loan);
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      return loan;
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
      throw new Error(err);
    }
  }

  async findLoan(
    where: Record<string, any>,
    relations = ['ewi'],
  ): Promise<Loan> {
    console.log(where.user, where.id, '>>>>>', relations);
    return this.loanRepository.findOne({
      where,
      relations: relations,
    });
  }

  async findAll(user: User): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { user: { id: user.id } },
      relations: ['ewi'],
    });
  }

  findOne(id: string, user: User) {
    return this.findLoan({ id, user: { id: user.id } });
  }

  async payLoan(id: string, updateLoanDto: UpdateLoanDto, user: User) {
    const loan = await this.findLoan({ id, user }, []);
    if (!loan || loan.approval === LoanStatus.PENDING) {
      throw new HttpException(
        { message: 'Loan is not approved yet' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (loan.paid === LoanPaid.PAID) {
      throw new HttpException(
        { message: 'Loan is already paid' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const amount = parseFloat(updateLoanDto.amount.toString());
    const loanEwi = await this.getUpcomingLoanEwi(id);
    if (amount < parseFloat(loanEwi.weeklyInstallment.toString())) {
      throw new HttpException(
        { message: 'Amount is less than the weekly amount to be paid' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (amount > parseFloat(loan.amount.toString())) {
      throw new HttpException(
        { message: 'Amount is more than the total amount to be paid' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      await QueryRunner.manager.update(LoanEwi, loanEwi.id, {
        weeklyInstallmentPaid: amount,
        paidOn: new Date(),
        paid: LoanPaid.PAID,
      });

      const remaingEwis = await this.remainingLoanEwi(
        loan,
        user,
        loanEwi.dueOn,
      );
      let loanStatus = LoanPaid.PENDING;
      const totalAmountPaid = parseFloat(loan.amountPaid.toString()) + amount;
      const remainingLoanAmount =
        parseFloat(loan.amount.toString()) - totalAmountPaid;
      const remainingLoanEwiTerms =
        parseInt(loan.terms.toString()) - parseInt(loanEwi.term.toString());
      const weeklyInstallment = remainingLoanEwiTerms
        ? remainingLoanAmount / remainingLoanEwiTerms
        : 0;
      console.log(
        totalAmountPaid,
        remainingLoanAmount,
        remainingLoanEwiTerms,
        weeklyInstallment,
        '>>>>>>>> calculated',
      );
      if (remainingLoanAmount == 0) {
        await QueryRunner.manager.update(Loan, loan.id, {
          paid: LoanPaid.PAID,
          paidTerms: loanEwi.term,
          amountPaid: totalAmountPaid,
        });
        loanStatus = LoanPaid.PAID;
      } else {
        await QueryRunner.manager.update(Loan, loan.id, {
          paidTerms: loanEwi.term,
          amountPaid: totalAmountPaid,
        });
      }
      await Promise.all(
        remaingEwis.map((ewi) =>
          QueryRunner.manager.update(LoanEwi, ewi.id, {
            weeklyInstallment,
            paidOn: remainingLoanAmount ? ewi.paidOn : new Date(),
            paid: loanStatus,
          }),
        ),
      );
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      return this.findLoan({ id, user }, []);
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
      throw new Error(err);
    }

    // update pending emi with amount
    // update loan paid status with terms
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }

  async getUpcomingLoanEwi(loan: string): Promise<LoanEwi> {
    return this.loanEwiRepository
      .createQueryBuilder('lewi')
      .where('"loanId" = :loan', { loan })
      .andWhere('"paid" = :status', { status: LoanStatus.PENDING })
      .addOrderBy('"dueOn"', 'ASC')
      .getOne();
  }

  async remainingLoanEwi(loan: Loan, user: User, date: Date) {
    return this.loanEwiRepository
      .createQueryBuilder('lewi')
      .where('"loanId" = :loan', { loan: loan.id })
      .andWhere('"dueOn" > :date', { date })
      .getMany();
  }
}
