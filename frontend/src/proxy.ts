import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Halaman yang khusus untuk tamu (belum login)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Halaman yang dilindungi (harus login)
  // Tambahkan rute lain jika ada, misalnya /projects, /profile, dll
  const protectedRoutes = ['/projects', '/profile', '/notifications'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // 1. Jika sudah login, cegah akses ke halaman login, register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  // 2. Jika belum login, cegah akses ke halaman dashboard/protected
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Hanya jalankan middleware ini pada rute aplikasi, abaikan file statis/Next.js internal
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};

