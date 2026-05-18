
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-supersecret-supersecret';

export async function POST(req: Request) {
  console.log('--- DATABASE AUTH ATTEMPT ---');
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.passwordHash) throw new Error('User has no passwordHash in database');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { passwordHash, ...userWithoutPassword } = user;

    const token = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    }, JWT_SECRET, { expiresIn: '7d' });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const response = NextResponse.json({ success: true, user: userWithoutPassword, token });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return response;
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Database Connection Error' }, { status: 500 });
  }
}
