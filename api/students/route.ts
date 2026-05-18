// app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    verifyAuth(request);

    const students = await prisma.student.findMany({
      include: {
        addedByUser: { select: { fullName: true } },
      },
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json(students);
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    const body = await request.json();

    const student = await prisma.student.create({
      data: {
        ...body,
        addedById: user.id,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
