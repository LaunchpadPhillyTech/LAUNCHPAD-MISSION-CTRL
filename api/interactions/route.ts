// app/api/interactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    verifyAuth(request);

    const interactions = await prisma.interaction.findMany({
      include: {
        partner: true,
        staff: true,
        students: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(interactions);
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    const body = await request.json();

    const interaction = await prisma.interaction.create({
      data: {
        ...body,
        staffId: user.id,
      },
      include: { partner: true, staff: true, students: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        targetType: 'Interaction',
        targetId: interaction.id,
        targetName: interaction.interactionType,
      },
    });

    return NextResponse.json(interaction, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error creating interaction:', error);
    return NextResponse.json(
      { error: 'Failed to create interaction' },
      { status: 500 }
    );
  }
}
