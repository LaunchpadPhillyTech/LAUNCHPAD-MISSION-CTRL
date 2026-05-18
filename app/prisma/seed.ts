import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const industries = [
  'Software',
  'Media',
  'Consulting',
  'AI',
  'Networking',
  'Biotech',
  'Analytics',
  'Cloud',
  'Robotics',
  'Engineering',
];

const orgs = [
  {
    name: 'Nexus Systems',
    logoUrl: 'https://placehold.co/400?text=Nexus',
    industry: 'Software',
    partnershipDate: new Date('2023-05-15'),
    status: 'Active',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://nexussystems.com',
  },
  {
    name: 'Solaris Media',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Media',
    partnershipDate: new Date('2023-06-01'),
    status: 'Active',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://solarismedia.com',
  },
  {
    name: 'Vertex Solutions',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Consulting',
    partnershipDate: new Date('2023-06-01'),
    status: 'Pending',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://vertexsolutions.com',
  },
  {
    name: 'QuantumSoft',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'AI',
    partnershipDate: new Date('2023-06-01'),
    status: 'Active',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://quantumsoft.ai',
  },
  {
    name: 'BluePeak Networks',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Networking',
    partnershipDate: new Date('2023-06-01'),
    status: 'Active',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://bluepeaknetworks.com',
  },
  {
    name: 'Helios Labs',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Biotech',
    partnershipDate: new Date('2023-06-01'),
    status: 'Pending',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://helioslabs.com',
  },
  {
    name: 'Pulse Analytics',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Analytics',
    partnershipDate: new Date('2023-06-01'),
    status: 'Active',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://pulseanalytics.com',
  },
  {
    name: 'Stratus Cloud',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Cloud',
    partnershipDate: new Date('2023-06-01'),
    status: 'Active',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://stratuscloud.com',
  },
  {
    name: 'Cobalt Robotics',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Robotics',
    partnershipDate: new Date('2023-06-01'),
    status: 'Pending',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://cobaltrobotics.com',
  },
  {
    name: 'Zenith Dynamics',
    logoUrl: 'https://placehold.co/400?text=Logo',
    industry: 'Engineering',
    partnershipDate: new Date('2023-06-01'),
    status: 'Active',
    description: 'Innovative solutions for modern businesses.',
    website: 'https://zenithdynamics.com',
  },
];

async function main() {
  await prisma.organization.deleteMany();
  for (const org of orgs) {
    await prisma.organization.create({ data: org });
  }
  console.log('Seeded organizations!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
