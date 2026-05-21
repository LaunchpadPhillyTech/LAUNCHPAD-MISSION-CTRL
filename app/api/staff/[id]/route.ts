import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { fullName, email, role, title, accessLevel } = body;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        { error: 'fullName, email, and role are required' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        email,
        role,
        title: title || null,
        accessLevel: accessLevel || null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        title: true,
        accessLevel: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    console.error('Failed to update staff member:', error);
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete staff member:', error);
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}
