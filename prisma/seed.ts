import 'dotenv/config';
import { PrismaClient, UserRole, OpportunityType, OpportunityStatus, ApplicationStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting CampusAttach database seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // -----------------------------
  // ADMIN
  // -----------------------------
  const admin = await prisma.user.upsert({
    where: { email: 'admin@campusattach.test' },
    update: {},
    create: {
      fullName: 'CampusAttach Admin',
      email: 'admin@campusattach.test',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // -----------------------------
  // STUDENT
  // -----------------------------
  const student = await prisma.user.upsert({
    where: { email: 'student@campusattach.test' },
    update: {},
    create: {
      fullName: 'Demo Student',
      email: 'student@campusattach.test',
      passwordHash,
      role: UserRole.STUDENT,
      isActive: true,
    },
  });

  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      university: 'University of Nairobi',
      course: 'Bachelor of Science in Computer Science',
      yearOfStudy: 3,
      phone: '0700000000',
      skills: 'TypeScript, Angular, NestJS, PostgreSQL',
      bio: 'Computer science student looking for practical attachment opportunities.',
    },
  });

  // -----------------------------
  // ORGANIZATION
  // -----------------------------
  const organizationUser = await prisma.user.upsert({
    where: { email: 'organization@campusattach.test' },
    update: {},
    create: {
      fullName: 'CampusAttach Demo Organization',
      email: 'organization@campusattach.test',
      passwordHash,
      role: UserRole.ORGANIZATION,
      isActive: true,
    },
  });

  const organization = await prisma.organization.upsert({
    where: { userId: organizationUser.id },
    update: {},
    create: {
      userId: organizationUser.id,
      name: 'Nairobi Digital Solutions',
      description: 'A technology organization providing software development and digital services.',
      location: 'Nairobi',
      phone: '0711111111',
      website: 'https://example.com',
    },
  });

  // -----------------------------
  // OPPORTUNITIES
  // -----------------------------
  let opportunity1 = await prisma.opportunity.findFirst({
    where: {
      title: 'Software Development Attachment',
      organizationId: organization.id,
    },
  });

  if (!opportunity1) {
    opportunity1 = await prisma.opportunity.create({
      data: {
        organizationId: organization.id,
        title: 'Software Development Attachment',
        type: OpportunityType.ATTACHMENT,
        location: 'Nairobi',
        description:
          'Practical software development attachment involving frontend and backend development.',
        requirements: 'Basic TypeScript, HTML, CSS and programming knowledge.',
        deadline: new Date('2027-06-30'),
        status: OpportunityStatus.OPEN,
      },
    });
  }

  let opportunity2 = await prisma.opportunity.findFirst({
    where: {
      title: 'Junior Software Engineering Internship',
      organizationId: organization.id,
    },
  });

  if (!opportunity2) {
    opportunity2 = await prisma.opportunity.create({
      data: {
        organizationId: organization.id,
        title: 'Junior Software Engineering Internship',
        type: OpportunityType.INTERNSHIP,
        location: 'Nairobi',
        description:
          'Internship opportunity for students interested in modern software engineering.',
        requirements: 'Programming fundamentals and willingness to learn.',
        deadline: new Date('2027-08-31'),
        status: OpportunityStatus.OPEN,
      },
    });
  }

  // -----------------------------
  // APPLICATION
  // -----------------------------
  await prisma.application.upsert({
    where: {
      studentProfileId_opportunityId: {
        studentProfileId: studentProfile.id,
        opportunityId: opportunity1.id,
      },
    },
    update: {},
    create: {
      studentProfileId: studentProfile.id,
      opportunityId: opportunity1.id,
      status: ApplicationStatus.PENDING,
      coverLetter:
        'I am interested in this opportunity because it will allow me to apply my software development skills in a practical environment.',
    },
  });

  console.log('Seed completed successfully.');
  console.log(`Admin: ${admin.email}`);
  console.log(`Student: ${student.email}`);
  console.log(`Organization: ${organizationUser.email}`);
  console.log(`Opportunities created/verified: ${opportunity1.title}, ${opportunity2.title}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });