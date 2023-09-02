import { instanceToPlain, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Index,
  OneToMany,
} from 'typeorm';
import { LoanEwi } from './loan-ewi.entity';
import { User } from './user.entity';

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

export enum LoanPaid {
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity()
export class Loan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 6, scale: 4 })
  amount: number;

  @Column('decimal', { precision: 6, scale: 4, default: 0.0 })
  amountPaid: number;

  @Column({ nullable: true, default: 0 })
  terms: number;

  @Column({ nullable: true, default: 0 })
  paidTerms: number;

  @Transform(({ value }) => value.id, { toPlainOnly: true })
  @ManyToOne(() => User)
  user: User;

  @Index({ unique: false })
  @Column({ type: 'timestamptz', nullable: true, default: new Date() })
  createdOn: Date;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  approval: LoanStatus;

  @Column({
    type: 'enum',
    enum: LoanPaid,
    default: LoanPaid.PENDING,
  })
  paid: LoanPaid;

  @OneToMany(() => LoanEwi, (ewi) => ewi.loan)
  ewi: LoanEwi[];

  toJSON() {
    return instanceToPlain(this);
  }
}
