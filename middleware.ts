import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protected routes
  const protectedRoutes = ['/movie', '/api/movies'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // For API routes, return 401 instead of redirect
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Simple JWT validation for Edge Runtime
    // We'll do a basic format check and let the API routes handle full verification
    const jwtParts = token.split('.');
    if (jwtParts.length !== 3) {
      // Invalid JWT format
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For now, assume token is valid if it has correct format
    // Full verification will be done in API routes
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/movie/:path*', '/api/movies/:path*']
};
