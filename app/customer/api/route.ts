// pages/api/customer.ts
'use server';

import { getSession, saveCustomerCode } from '@/app/lib/auth';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  const customerCode = await request.json();

  console.log('body', customerCode);
  console.log('Customer Code', request.cookies.get('customerCode'));
  console.log('All cookies', request.cookies);

  return Response.json({ test: 'TEST' });
}
