import { IsDecimal, IsNotEmpty } from 'class-validator';

export class UpdateLoanDto {
  @IsNotEmpty({ message: 'Loan Amount is required' })
  @IsDecimal({ decimal_digits: '1,6' })
  amount: number;
}
