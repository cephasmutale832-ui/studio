
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { type Session } from '@/lib/types';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  let session: Session | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie);
    } catch (e) {
      // Invalid cookie, treat as unauthenticated
    }
  }
  
  const isAuthPage = ['/login', '/'].includes(request.nextUrl.pathname);
  
  // If trying to access a protected route without a session, redirect to login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If on an auth page with a valid session, redirect to dashboard
  if (isAuthPage && session) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/'],
};
