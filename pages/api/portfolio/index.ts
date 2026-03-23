import type { NextApiRequest, NextApiResponse } from 'next';
import { CORE_POSITIONS } from '@/lib/portfolio-logic';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json(CORE_POSITIONS);

    case 'POST':
    case 'DELETE':
      // Data is now static — writes are not supported
      return res.status(200).json({ success: true });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
