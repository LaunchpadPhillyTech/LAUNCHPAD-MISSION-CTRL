import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-supersecret-supersecret';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  console.log('Middleware:', pathname, 'token:', !!token);

  // --- API ROUTE HANDLING ---
  // 1. Immediately pass through all API requests.
  if (pathname.startsWith('/api')) {
    console.log('API request, passing through');
    return NextResponse.next();
  }

  // --- PAGE ROUTE GUARD LOGIC ---
  // 2. Handle the login page specifically.
  if (pathname === '/login') {
    // If user is already authenticated, redirect them from login to the dashboard.
    if (token) {
      try {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Invalid token, allow access to login
      }
    }
    // Otherwise, allow access to the login page.
    return NextResponse.next();
  }

  // 3. Protect all other pages.
  // If there is no token or invalid, redirect to the login page.
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    // 4. If a token exists and is valid, allow access to the requested page.
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (image files)
     * - fonts/ (font files)
     * This ensures the middleware runs on all pages and API routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
