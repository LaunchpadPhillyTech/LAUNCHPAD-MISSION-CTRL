// app/api/partners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    verifyAuth(request);

    const partners = await prisma.partner.findMany({
      include: {
        contacts: true,
        _count: {
          select: { interactions: true, students: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(partners);
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    const body = await request.json();

    const partner = await prisma.partner.create({
      data: {
        ...body,
        createdById: user.id,
      },
      include: { contacts: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        targetType: 'Partner',
        targetId: partner.id,
        targetName: partner.organizationName,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
