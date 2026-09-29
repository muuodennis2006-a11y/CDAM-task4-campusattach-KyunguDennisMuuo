import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Get('opportunities')
  getOpportunities() {
    return this.adminService.getOpportunities();
  }

  @Patch('opportunities/:id/status')
  updateOpportunityStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status')
    status: 'OPEN' | 'CLOSED' | 'PENDING' | 'REJECTED',
  ) {
    return this.adminService.updateOpportunityStatus(id, status);
  }
}
