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
import { StudentsService } from './students.service';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

@Controller('students')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('STUDENT')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.studentsService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.updateProfile(req.user.userId, dto);
  }
}
