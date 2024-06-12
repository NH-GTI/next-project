import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { fetchUser } from './data';
import { redirect } from 'next/navigation';

const secretKey = process.env.SECRET_KEY || 'default_secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m') // Expiration time in minutes
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(formData: FormData) {
  try {
    const bcrypt = await import('bcrypt');
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString() || '';

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const userFromDB = await fetchUser(email);
    if (!userFromDB) {
      throw new Error('User not found');
    }

    const passwordsMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordsMatch) {
      throw new Error('Invalid credentials');
    }

    // Create the session
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const session = await encrypt({ user: userFromDB, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });

    // Return the redirection response
    return NextResponse.redirect(
      new URL('/', process.env.BASE_URL || 'http://localhost:3000'),
    ); // Ensure absolute URL
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error');
    }

    // Return the redirection response in case of an error
    return NextResponse.redirect(
      new URL('/login', process.env.BASE_URL || 'http://localhost:3000'),
    ); // Ensure absolute URL
  }
}

export async function saveCustomerCode(customerCode: string) {
  // session.customerCode = clientCode;
  const encryptedSession = await encrypt({ customerCode }); // Ensure you have an encrypt function

  // Update session cookie
  cookies().set('customerCode', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
  return NextResponse.redirect(
    new URL('/login', process.env.BASE_URL || 'http://localhost:3000'),
  ); // Ensure absolute URL
}

export async function getSession(cookie: string) {
  const session = cookies().get(cookie)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const res = NextResponse.next();
  res.cookies.set('session', await encrypt(parsed), {
    expires: parsed.expires,
    httpOnly: true,
  });
  return res;
}
