// lib/auth.ts - JWT verification and auth utilities for Next.js API routes
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-supersecret-supersecret';

/**
 * Verify JWT token from request headers
 * Returns decoded payload or throws error
 */
export function verifyAuth(request: Request): JwtPayload {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) throw new Error('No token provided');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Generate JWT token for user
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
