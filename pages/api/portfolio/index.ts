import type { NextApiRequest, NextApiResponse } from 'next';
import { getPositions, upsertLots, closePosition } from '@/lib/portfolio-writer';

function isAuthorized(req: NextApiRequest): boolean {
  const key = req.headers['admin-key'];
  return typeof key === 'string' && key === process.env.ADMIN_KEY;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json(getPositions());

    case 'POST': {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });

      const { symbol, lots } = req.body;
      if (!symbol || !Array.isArray(lots)) {
        return res.status(400).json({ error: 'symbol and lots are required' });
      }

      try {
        upsertLots(symbol, lots);
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: e.message });
      }
    }

    case 'DELETE': {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });

      const { symbol } = req.query;
      if (!symbol || typeof symbol !== 'string') {
        return res.status(501).json({ error: 'Clear-all not supported' });
      }

      try {
        closePosition(symbol);
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: e.message });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
