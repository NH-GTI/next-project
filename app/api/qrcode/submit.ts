import type { NextApiRequest, NextApiResponse } from 'next';
import { createQRCode } from '@/app/lib/data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = req.body;
  const id = await createQRCode(data);
  res.status(200).json({ id });
}
