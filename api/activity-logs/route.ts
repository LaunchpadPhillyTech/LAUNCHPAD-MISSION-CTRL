// app/api/activity-logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    verifyAuth(request);

    const logs = await prisma.activityLog.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 logs
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
