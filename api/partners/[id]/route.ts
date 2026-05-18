// app/api/partners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAuth(request);
    const { id } = await params;

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        contacts: true,
        interactions: {
          include: { staff: true },
          orderBy: { date: 'desc' },
        },
        students: true,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(request);
    const { id } = await params;
    const body = await request.json();

    const partner = await prisma.partner.update({
      where: { id },
      data: body,
      include: { contacts: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE',
        targetType: 'Partner',
        targetId: partner.id,
        targetName: partner.organizationName,
      },
    });

    return NextResponse.json(partner);
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(request);
    const { id } = await params;

    const partner = await prisma.partner.delete({
      where: { id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'DELETE',
        targetType: 'Partner',
        targetId: partner.id,
        targetName: partner.organizationName,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      { error: 'Failed to delete partner' },
      { status: 500 }
    );
  }
}
