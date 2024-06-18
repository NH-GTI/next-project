import NextAuth from 'next-auth';
import { options } from './options';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { getUser } from '@/app/lib/data';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        // console.log(credentials?.email ?? 'john@doe.com');
        const user = await getUser(credentials?.email ?? 'john@doe.com');
        // console.log('User :', user);
        const passwordCorrect = await compare(
          credentials?.password || '',
          user.password,
        );
        console.log(passwordCorrect);

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
