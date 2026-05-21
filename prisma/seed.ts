import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user (test@launchpad.com / password123)
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'test@launchpad.com' },
    update: {},
    create: {
      email: 'test@launchpad.com',
      passwordHash,
      fullName: 'Test User',
      role: 'ADMINISTRATOR',
      title: 'Test Admin',
      accessLevel: 'admin',
    },
  });

  const seededStaff = [
    {
      email: 'aisha.cooper@launchpad.com',
      fullName: 'Aisha Cooper',
      role: 'PARTNERSHIP_MANAGER' as const,
      title: 'Partnership Manager',
      accessLevel: 'manager',
    },
    {
      email: 'marcus.lee@launchpad.com',
      fullName: 'Marcus Lee',
      role: 'PROGRAM_COORDINATOR' as const,
      title: 'Program Coordinator',
      accessLevel: 'coordinator',
    },
    {
      email: 'nina.patel@launchpad.com',
      fullName: 'Nina Patel',
      role: 'STAFF_USER' as const,
      title: 'Outreach Specialist',
      accessLevel: 'staff',
    },
  ];

  for (const staff of seededStaff) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        fullName: staff.fullName,
        role: staff.role,
        title: staff.title,
        accessLevel: staff.accessLevel,
      },
      create: {
        email: staff.email,
        passwordHash,
        fullName: staff.fullName,
        role: staff.role,
        title: staff.title,
        accessLevel: staff.accessLevel,
      },
    });
  }


  // Create 10 realistic tech organizations with upsert by unique name
  const organizations = [
    {
      name: 'Launchpad Technologies',
      logoUrl: 'https://placehold.co/400?text=Launchpad',
      industry: 'Software',
      partnershipDate: new Date('2023-01-15'),
      status: 'Active',
      description: 'Cloud-based solutions for startups and enterprises.',
      website: 'https://launchpad.com',
    },
    {
      name: 'Neon Robotics',
      logoUrl: 'https://placehold.co/400?text=Neon+Robotics',
      industry: 'Robotics',
      partnershipDate: new Date('2022-11-10'),
      status: 'Active',
      description: 'AI-powered robotics for manufacturing.',
      website: 'https://neonrobotics.ai',
    },
    {
      name: 'QuantumLeap Analytics',
      logoUrl: 'https://placehold.co/400?text=QuantumLeap',
      industry: 'Data Analytics',
      partnershipDate: new Date('2024-02-20'),
      status: 'Inactive',
      description: 'Advanced analytics and business intelligence.',
      website: 'https://quantumleap.io',
    },
    {
      name: 'SkyNet Security',
      logoUrl: 'https://placehold.co/400?text=SkyNet',
      industry: 'Cybersecurity',
      partnershipDate: new Date('2023-07-01'),
      status: 'Active',
      description: 'Next-gen cybersecurity for cloud infrastructure.',
      website: 'https://skynetsecurity.com',
    },
    {
      name: 'GreenTech Innovations',
      logoUrl: 'https://placehold.co/400?text=GreenTech',
      industry: 'Clean Energy',
      partnershipDate: new Date('2022-05-18'),
      status: 'Active',
      description: 'Sustainable energy solutions for a greener planet.',
      website: 'https://greentech.com',
    },
    {
      name: 'MedAI Health',
      logoUrl: 'https://placehold.co/400?text=MedAI',
      industry: 'Healthcare AI',
      partnershipDate: new Date('2023-09-12'),
      status: 'Inactive',
      description: 'AI-driven diagnostics and patient care.',
      website: 'https://medaihealth.com',
    },
    {
      name: 'EduVerse',
      logoUrl: 'https://placehold.co/400?text=EduVerse',
      industry: 'EdTech',
      partnershipDate: new Date('2024-01-05'),
      status: 'Active',
      description: 'Immersive learning platforms for schools.',
      website: 'https://eduverse.org',
    },
    {
      name: 'FinSight',
      logoUrl: 'https://placehold.co/400?text=FinSight',
      industry: 'FinTech',
      partnershipDate: new Date('2022-10-22'),
      status: 'Inactive',
      description: 'Financial analytics and investment tools.',
      website: 'https://finsight.com',
    },
    {
      name: 'UrbanAI Mobility',
      logoUrl: 'https://placehold.co/400?text=UrbanAI',
      industry: 'Mobility',
      partnershipDate: new Date('2023-03-30'),
      status: 'Active',
      description: 'Smart mobility solutions for urban areas.',
      website: 'https://urbanai.com',
    },
    {
      name: 'PixelForge Studios',
      logoUrl: 'https://placehold.co/400?text=PixelForge',
      industry: 'Digital Media',
      partnershipDate: new Date('2022-12-14'),
      status: 'Active',
      description: 'Creative digital content and media production.',
      website: 'https://pixelforge.com',
    },
  ];

  for (const org of organizations) {
    await prisma.organization.upsert({
      where: { name: org.name },
      update: org,
      create: org,
    });
  }

  const defaultUser = await prisma.user.findUnique({
    where: { email: 'test@launchpad.com' },
    select: { id: true },
  });

  if (!defaultUser) {
    throw new Error('Default user not found after seed upsert');
  }

  let demoPartner = await prisma.partner.findFirst({
    where: {
      organizationName: 'Launchpad Technologies',
      createdById: defaultUser.id,
    },
    select: { id: true },
  });

  if (!demoPartner) {
    demoPartner = await prisma.partner.create({
      data: {
        organizationName: 'Launchpad Technologies',
        websiteUrl: 'https://launchpad.com',
        schoolType: 'University',
        partnerStatus: 'Active',
        createdById: defaultUser.id,
        tags: ['featured', 'core-partner'],
      },
      select: { id: true },
    });
  }

  const seededStudents = [
    {
      fullName: 'Jordan Smith',
      email: 'jordan.smith@example.com',
      status: 'ACTIVE_MEMBER' as const,
      cohort: 'Spring 2026',
      earlyReleaseEligible: true,
    },
    {
      fullName: 'Maya Johnson',
      email: 'maya.johnson@example.com',
      status: 'APPLICANT' as const,
      cohort: 'Spring 2026',
      earlyReleaseEligible: false,
    },
    {
      fullName: 'Ethan Brooks',
      email: 'ethan.brooks@example.com',
      status: 'ACTIVE_MEMBER' as const,
      cohort: 'Winter 2026',
      earlyReleaseEligible: true,
    },
  ];

  for (const student of seededStudents) {
    const existing = await prisma.student.findFirst({
      where: {
        fullName: student.fullName,
        partnerId: demoPartner.id,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.student.update({
        where: { id: existing.id },
        data: {
          email: student.email,
          status: student.status,
          cohort: student.cohort,
          earlyReleaseEligible: student.earlyReleaseEligible,
        },
      });
    } else {
      await prisma.student.create({
        data: {
          fullName: student.fullName,
          email: student.email,
          partnerId: demoPartner.id,
          status: student.status,
          cohort: student.cohort,
          earlyReleaseEligible: student.earlyReleaseEligible,
          addedById: defaultUser.id,
        },
      });
    }
  }

  const emailEvents = [
    { to: 'principal@launchpad.com', subject: 'Partnership Kickoff Follow-up' },
    { to: 'career@launchpad.com', subject: 'Spring Cohort Status Check' },
    { to: 'ops@launchpad.com', subject: 'Interview Day Coordination' },
  ];

  for (const event of emailEvents) {
    const existingEmail = await prisma.emailLog.findFirst({
      where: {
        userId: defaultUser.id,
        to: event.to,
        subject: event.subject,
      },
      select: { id: true },
    });

    if (!existingEmail) {
      await prisma.emailLog.create({
        data: {
          userId: defaultUser.id,
          to: event.to,
          subject: event.subject,
          sentAt: new Date(),
        },
      });
    }
  }

  console.log('Seed data created successfully (users + organizations + dashboard metrics).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
