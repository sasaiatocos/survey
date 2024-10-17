import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLogin = request.cookies.get('jwt')?.value;

  if (isLogin && !request.nextUrl.pathname.startsWith('/')) {
    return Response.redirect(new URL('/', request.url));
  }

  if (!isLogin && !request.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}