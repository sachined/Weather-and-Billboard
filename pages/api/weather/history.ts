import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // No persistence layer — return empty history
      return res.status(200).json([]);

    case 'POST':
    case 'DELETE':
      // No persistence layer — accept silently
      return res.status(200).json({ success: true });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}