// pages/api/customer.ts
import { NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
import { getSession, saveCustomerCode } from '@/app/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.json();
  const { customerCode } = body;
  //   console.log(body);
  //   console.log(customerCode);

  //   return Response.json({ test: 'POST' });
  //   if (req.method === 'POST') {
  //     const { clientCode } = req.body;
  //     console.log('Received clientCode:', clientCode);
  //     console.log('Req:', req);
  //     console.log('Req:', req.body);
  // const session = await getSession({ req });
  //   console.log(customerCode);

  await saveCustomerCode(customerCode);
  console.log(cookies().get('customerCode'));
  const cookieCustomerCode = cookies().get('customerCode');
  console.log(await getSession('customerCode'));

  return Response.json({ test: 'TEST' });

  //     if (!clientCode) {
  //       return res.status(400).json({ error: 'Client code is required' });
  //     }

  //     try {
  //       const session = await getSession({ req });
  //       console.log('Session data:', session);

  //       if (!session) {
  //         return res.status(401).json({ error: 'Not authenticated' });
  //       }

  //       await saveCustomerCode(session, clientCode);
  //       res.status(200).json({ message: 'Client code saved successfully' });
  //     } catch (error) {
  //       console.error('Error saving client code:', error);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //     }
  //   } else {
  //     res.setHeader('Allow', ['POST']);
  //     res.status(405).end(`Method ${req.method} Not Allowed`);
  //   }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return Response.json({ test: 'test' });
}
