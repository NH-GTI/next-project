import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Logout from './logout';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <nav>
          {!!session && <Logout />}
          {!session && <Link href="/login">Login</Link>}
        </nav>
        {children}
      </body>
    </html>
  );
}
