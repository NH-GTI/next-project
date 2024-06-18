import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { fetchUser } from '../../../lib/data';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
        const bcrypt = await import('bcrypt');
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        const userFromDB = await fetchUser(email);
        if (!userFromDB) {
          throw new Error('User not found');
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          userFromDB.password,
        );
        if (!passwordsMatch) {
          throw new Error('Invalid credentials');
        }

        return userFromDB;
      },
    }),
  ],
  // pages: {
  //   signIn: '/login', // Specify your custom login page here
  // },
  secret: process.env.NEXTAUTH_SECRET,
};
