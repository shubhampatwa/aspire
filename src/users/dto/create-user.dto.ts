import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;
}
