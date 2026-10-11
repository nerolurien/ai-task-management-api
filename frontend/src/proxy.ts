import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const protectedRoutes = ['/projects', '/profile', '/notifications'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};

