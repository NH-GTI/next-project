import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET || 'default_secret';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const token = await getToken({ req: request, secret });
  const url = request.nextUrl.clone();
  // const allCookies = request.cookies;
  response.cookies.set('customer-code', '123456', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
  });
  const cookieCustomerCode = request.cookies.get('customer-code');

  // // Paths to exclude from middleware logic
  const excludedPaths = [
    '/login',
    '/_next',
    '/static',
    '/favicon.ico',
    '/dashboard/customers',
  ];

  if (excludedPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(
      new URL('/login', process.env.BASE_URL || 'http://localhost:3000'),
    );
  }

  // // Additional check for whether a customer has been chosen
  if (!cookieCustomerCode) {
    return NextResponse.redirect(
      new URL(
        '/dashboard/customers',
        process.env.BASE_URL || 'http://localhost:3000',
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
