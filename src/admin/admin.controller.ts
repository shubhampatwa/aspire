import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('loan')
  findAll() {
    return this.adminService.findAll();
  }

  @Get('loan/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch('loan/:id')
  update(@Param('id') id: string) {
    return this.adminService.update(id);
  }
}
