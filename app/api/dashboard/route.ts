import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      activeStudents,
      earlyReleaseEligible,
      addedThisMonth,
      recentEmails,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: 'ACTIVE_MEMBER' } }),
      prisma.student.count({ where: { earlyReleaseEligible: true } }),
      prisma.student.count({ where: { addedDate: { gte: startOfMonth } } }),
      prisma.emailLog.findMany({
        orderBy: { sentAt: 'desc' },
        take: 8,
        select: {
          id: true,
          userId: true,
          to: true,
          subject: true,
          sentAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalStudents,
      activeStudents,
      earlyReleaseEligible,
      addedThisMonth,
      recentEmails,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}
