import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
// import { options } from './app/api/auth/[...nextauth]/options';

const secret = process.env.NEXTAUTH_SECRET || 'default_secret';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  // const session = await getServerSession({ req: request, ...options });
  const url = request.nextUrl.clone();

  // Paths to exclude from middleware logic
  const excludedPaths = [
    '/login',
    '/dashboard/customer',
    '/_next',
    '/static',
    '/favicon.ico',
  ];

  if (excludedPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }
  console.log(token);

  if (!token) {
    return NextResponse.redirect(
      new URL('/login', process.env.BASE_URL || 'http://localhost:3000'),
    );
  }

  // Additional check for whether a customer has been chosen
  if (!token.customerCode) {
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
