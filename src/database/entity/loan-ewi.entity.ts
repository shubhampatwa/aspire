import { instanceToPlain, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Index,
} from 'typeorm';
import { Loan } from './loan.entity';

export enum LoanPaid {
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity()
export class LoanEwi extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => value.id, { toPlainOnly: true })
  @ManyToOne(() => Loan)
  loan: Loan;

  @Column('decimal', { precision: 6, scale: 4 })
  weeklyInstallment: number;

  @Column('decimal', { precision: 6, scale: 4, nullable: true })
  weeklyInstallmentPaid: number;

  @Index({ unique: false })
  @Column({ type: 'timestamptz', default: new Date() })
  dueOn: Date;

  @Index({ unique: false })
  @Column({ type: 'timestamptz', nullable: true })
  paidOn: Date;

  @Column({
    type: 'enum',
    enum: LoanPaid,
    default: LoanPaid.PENDING,
  })
  paid: LoanPaid;

  @Column({ nullable: true, default: 0 })
  term: number;

  toJSON() {
    return instanceToPlain(this);
  }
}
