import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE' && !req.query.city) {
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

  const col = db.collection('weather_history');

  switch (req.method) {
    case 'GET': {
      try {
        const history = await col
          .find({}, { projection: { _id: 0, cityName: 1 } })
          .sort({ searchedAt: -1 })
          .limit(5)
          .toArray();
        return res.status(200).json(history.map(item => item.cityName));
      } catch (e: any) {
        return res.status(500).json({ error: 'Failed to fetch history', details: e.message });
      }
    }

    case 'POST': {
      try {
        const { city } = req.body;
        if (!city) return res.status(400).json({ error: 'City name is required' });
        const cityName = city.trim().toUpperCase();
        await col.findOneAndUpdate(
          { cityName },
          { $set: { cityName, searchedAt: new Date() } },
          { upsert: true }
        );
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'Failed to update history', details: e.message });
      }
    }

    case 'DELETE': {
      try {
        const { city } = req.query;
        if (typeof city === 'string' && city.trim()) {
          const result = await col.deleteOne({ cityName: city.trim().toUpperCase() });
          if (result.deletedCount === 0) return res.status(404).json({ error: 'City not found' });
          return res.status(200).json({ success: true });
        }
        await col.deleteMany({});
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'Failed to clear history', details: e.message });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
