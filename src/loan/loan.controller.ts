import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { UserAuthGuard } from 'src/users/guards/user-auth.guard';
import { UserReq } from 'src/users/user.interface';

@Controller('loan')
@UseGuards(UserAuthGuard)
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto, @Req() req: UserReq) {
    return this.loanService.create(createLoanDto, req.user);
  }

  @Get()
  findAll(@Req() req: UserReq) {
    return this.loanService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: UserReq) {
    return this.loanService.findOne(id, req.user);
  }

  @Put(':id/pay')
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
    @Req() req: UserReq,
  ) {
    return this.loanService.payLoan(id, updateLoanDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }
}
