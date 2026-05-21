import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
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
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, role, title, accessLevel } = body;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        { error: 'fullName, email, and role are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
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

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    console.error('Failed to create staff:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}
