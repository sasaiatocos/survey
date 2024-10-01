import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith('/admin'))
        {
          const roleIsAdmin = token?.role === 'admin'
          return roleIsAdmin;
        }
        return !!token;
      },
    },
    pages: {
      signIn: '/',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*','/user/:path*'],
};