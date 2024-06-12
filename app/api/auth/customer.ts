// pages/api/customer.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { saveCustomerCode } from '@/app/lib/auth';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return Response.json({ test: 'POST' });

    //   const { clientCode } = req.body;
    //   console.log('Received clientCode:', clientCode);

    //   if (!clientCode) {
    //     return res.status(400).json({ error: 'Client code is required' });
    //   }

    //   try {
    //     const session = await getSession({ req });
    //     console.log('Session data:', session);

    //     if (!session) {
    //       return res.status(401).json({ error: 'Not authenticated' });
    //     }

    //     await saveCustomerCode(session, clientCode);
    //     res.status(200).json({ message: 'Client code saved successfully' });
    //   } catch (error) {
    //     console.error('Error saving client code:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // } else {
    //   res.setHeader('Allow', ['POST']);
    //   res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
