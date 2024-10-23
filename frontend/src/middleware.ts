import type { NextRequest } from 'next/server';
import { currentUser } from './app/services/currentUser';

export async function middleware(request: NextRequest) {
  const isLogin = await currentUser();

  if (isLogin && isLogin.hashedRefreshToken !== null && !request.nextUrl.pathname.startsWith('/')) {
    return Response.redirect(new URL('/', request.url));
  }

  if (isLogin && isLogin.hashedRefreshToken === null && !request.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}