import { instanceToPlain } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Loan } from './loan.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Loan, (loan) => loan.user)
  loan: Loan[];

  toJSON() {
    return instanceToPlain(this);
  }

  @BeforeInsert()
  lowerCaseName() {
    this.name = this.name?.toLowerCase();
  }
}
