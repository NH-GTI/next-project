// pages/api/logout.js
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export default function handler(request: NextRequest, response: NextResponse) {
  cookies().set('session', '', { expires: new Date(0) });
  response.status(200).json({ message: 'Logged out' });
}
