import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { QueryOpportunityDto } from './dto/query-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOpportunityDto) {
    const {
      q,
      type,
      location,
      status = 'OPEN',
      page = 1,
      limit = 10,
    } = query;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      status,
    };

    if (type) {
      where.type = type;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (q) {
      where.OR = [
        {
          title: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [opportunities, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        include: {
          organization: true,
        },
        orderBy: {
          postedDate: 'desc',
        },
        skip,
        take: safeLimit,
      }),
      this.prisma.opportunity.count({
        where,
      }),
    ]);

    return {
      data: opportunities,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: number) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
        applications: true,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return opportunity;
  }

  async create(userId: number, dto: CreateOpportunityDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization profile not found');
    }

    return this.prisma.opportunity.create({
      data: {
        organizationId: organization.id,
        title: dto.title,
        type: dto.type,
        location: dto.location,
        description: dto.description,
        requirements: dto.requirements,
        deadline: new Date(dto.deadline),
      },
      include: {
        organization: true,
      },
    });
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateOpportunityDto,
  ) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.organization.userId !== userId) {
      throw new ForbiddenException(
        'You can only update your own opportunities',
      );
    }

    return this.prisma.opportunity.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(dto.requirements !== undefined && {
          requirements: dto.requirements,
        }),
        ...(dto.deadline !== undefined && {
          deadline: new Date(dto.deadline),
        }),
      },
      include: {
        organization: true,
      },
    });
  }

  async remove(userId: number, id: number) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.organization.userId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own opportunities',
      );
    }

    await this.prisma.opportunity.delete({
      where: { id },
    });

    return {
      message: 'Opportunity deleted successfully',
    };
  }
}
