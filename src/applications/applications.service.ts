import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApplicationStatus,
  OpportunityStatus,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    opportunityId: number,
    dto: CreateApplicationDto,
  ) {
    const opportunity =
      await this.prisma.opportunity.findUnique({
        where: { id: opportunityId },
      });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.status !== OpportunityStatus.OPEN) {
      throw new ConflictException(
        'This opportunity is not open for applications',
      );
    }

    if (new Date(opportunity.deadline) < new Date()) {
      throw new ConflictException(
        'The application deadline has passed',
      );
    }

    let studentProfile =
      await this.prisma.studentProfile.findUnique({
        where: { userId },
      });

    if (!studentProfile) {
      studentProfile =
        await this.prisma.studentProfile.create({
          data: {
            userId,
          },
        });
    }

    const existing =
      await this.prisma.application.findUnique({
        where: {
          studentProfileId_opportunityId: {
            studentProfileId: studentProfile.id,
            opportunityId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'You have already applied for this opportunity',
      );
    }

    return this.prisma.application.create({
      data: {
        studentProfileId: studentProfile.id,
        opportunityId,
        coverLetter: dto.coverLetter,
        status: ApplicationStatus.PENDING,
      },
      include: {
        opportunity: {
          include: {
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async myApplications(userId: number) {
    return this.prisma.application.findMany({
      where: {
        studentProfile: {
          userId,
        },
      },
      orderBy: {
        appliedDate: 'desc',
      },
      include: {
        opportunity: {
          include: {
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async organizationApplications(
    userId: number,
    opportunityId: number,
  ) {
    const opportunity =
      await this.prisma.opportunity.findUnique({
        where: { id: opportunityId },
        include: {
          organization: true,
        },
      });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.organization.userId !== userId) {
      throw new ForbiddenException(
        'You can only view applicants for your own opportunities',
      );
    }

    return this.prisma.application.findMany({
      where: {
        opportunityId,
      },
      orderBy: {
        appliedDate: 'desc',
      },
      include: {
        studentProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(
    userId: number,
    applicationId: number,
    dto: UpdateApplicationStatusDto,
  ) {
    const application =
      await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          opportunity: {
            include: {
              organization: true,
            },
          },
        },
      });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (
      application.opportunity.organization.userId !== userId
    ) {
      throw new ForbiddenException(
        'You can only update applications for your own opportunities',
      );
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: dto.status,
      },
    });
  }
}
