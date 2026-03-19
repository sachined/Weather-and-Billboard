import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    const isDev = process.env.NODE_ENV === 'development';
    const adminKey = process.env.ADMIN_KEY;
    const providedKey = req.headers['admin-key'] ||
      (req.headers['authorization']?.startsWith('Bearer ')
        ? req.headers['authorization'].split(' ')[1]
        : null);

    if (!isDev && (!adminKey || providedKey !== adminKey)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  }

  let db;
  try {
    db = await getDb();
  } catch (e: any) {
    return res.status(500).json({ error: 'Database Connection Error', details: e.message });
  }

  const col = db.collection('positions');

  switch (req.method) {
    case 'GET': {
      try {
        const positions = await col.find({}, { projection: { _id: 0 } }).toArray();
        return res.status(200).json(positions);
      } catch (e: any) {
        return res.status(500).json({ error: 'Failed to fetch positions', details: e.message });
      }
    }

    case 'POST': {
      try {
        const { symbol, shares, addedAt, costBasis } = req.body;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

        const doc: Record<string, unknown> = {
          symbol: symbol.toUpperCase().trim(),
          shares,
          addedAt: addedAt || new Date().toISOString().split('T')[0],
        };
        if (costBasis !== undefined && costBasis !== null && costBasis !== '') {
          doc.costBasis = Number(costBasis);
        }

        await col.findOneAndUpdate(
          { symbol: doc.symbol },
          { $set: doc },
          { upsert: true }
        );
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'Failed to update position', details: e.message });
      }
    }

    case 'DELETE': {
      try {
        const { symbol } = req.query;
        if (typeof symbol === 'string' && symbol.trim()) {
          const result = await col.deleteOne({ symbol: symbol.toUpperCase().trim() });
          if (result.deletedCount === 0) return res.status(404).json({ error: 'Position not found' });
          return res.status(200).json({ success: true });
        }
        await col.deleteMany({});
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'Failed to delete position', details: e.message });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
