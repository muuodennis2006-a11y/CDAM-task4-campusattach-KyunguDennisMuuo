import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrganizationProfileDto } from './dto/update-organization-profile.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization profile not found');
    }

    return organization;
  }

  async updateProfile(
    userId: number,
    dto: UpdateOrganizationProfileDto,
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization profile not found');
    }

    return this.prisma.organization.update({
      where: { userId },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }
}
