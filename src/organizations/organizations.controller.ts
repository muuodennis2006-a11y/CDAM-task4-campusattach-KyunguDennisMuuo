import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationProfileDto } from './dto/update-organization-profile.dto';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ORGANIZATION')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.organizationsService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateOrganizationProfileDto,
  ) {
    return this.organizationsService.updateProfile(
      req.user.userId,
      dto,
    );
  }
}
