import { NextResponse } from 'next/server';

export async function GET() {
  // Remove the authToken cookie (client-side auth uses localStorage, but for future-proofing)
  const response = NextResponse.json({ message: 'Auth cleared' });
  response.cookies.set('authToken', '', { maxAge: 0, path: '/' });
  return response;
}
