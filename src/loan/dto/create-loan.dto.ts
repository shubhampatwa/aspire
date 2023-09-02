import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty({ message: 'Loan Amount is required' })
  @IsDecimal({ decimal_digits: '1,6' })
  amount: number;

  @IsNotEmpty({ message: 'Loadn Terms is required' })
  @IsNumber()
  terms: number;
}
