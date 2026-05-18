import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user (test@launchpad.com / password123)
  const passwordHash = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
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

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
