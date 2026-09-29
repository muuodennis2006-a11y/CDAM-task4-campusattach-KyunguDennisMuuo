import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationsService } from './applications.service';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post('opportunities/:id/applications')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Apply for an opportunity' })
  create(
    @Request() req: any,
    @Param('id', ParseIntPipe) opportunityId: number,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(
      req.user.userId,
      opportunityId,
      dto,
    );
  }

  @Get('applications/my')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Track my applications' })
  myApplications(@Request() req: any) {
    return this.applicationsService.myApplications(
      req.user.userId,
    );
  }

  @Get('opportunities/:id/applications')
  @Roles('ORGANIZATION')
  @ApiOperation({ summary: 'View applicants for an opportunity' })
  organizationApplications(
    @Request() req: any,
    @Param('id', ParseIntPipe) opportunityId: number,
  ) {
    return this.applicationsService.organizationApplications(
      req.user.userId,
      opportunityId,
    );
  }

  @Patch('applications/:id/status')
  @Roles('ORGANIZATION')
  @ApiOperation({ summary: 'Update application status' })
  updateStatus(
    @Request() req: any,
    @Param('id', ParseIntPipe) applicationId: number,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      req.user.userId,
      applicationId,
      dto,
    );
  }
}
