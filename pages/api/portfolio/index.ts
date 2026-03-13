// Develop API Routes for Portfolio to handle GET (fetch from DB) and POST (save to DB)
import type { NextApiRequest, NextApiResponse } from 'next';
import Position from '@/models/Position';
import dbConnect from "@/lib/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'GET') {
    const isDev = process.env.NODE_ENV === 'development';
    const adminKey = process.env.ADMIN_KEY;
    const providedKey = req.headers['admin-key'] || (req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'].split(' ')[1] : null);

    // RULE: If NOT dev AND no valid Admin Key is provided, block the request.
    // This prevents unauthorized data modification.
    if (!isDev && (!adminKey || providedKey !== adminKey)) {
      return res.status(403).json({
        error: 'Unauthorized: Modification is only allowed in development or with a valid admin-key header.'
      });
    }
  }

  // 2. Wrap the connection attempt specifically
  try {
    await dbConnect();
  } catch (e: any) {
    return res.status(500).json({
      error: 'Database Connection Error',
      details: e.message
    });
  }

  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        // Fetch all positions from the collection
        const positions = await Position.find({});
        res.status(200).json(positions);
      } catch (e: any) {
        res.status(500).json({ error: 'Failed to fetch positions', details: e.message });
      }
      break;

    case 'POST':
      try {
        const { symbol, shares, addedAt } = req.body;

        if (!symbol) {
          return res.status(400).json({ error: 'Symbol is required' });
        }

        // Use Mongoose to find and update, or create if not found (upsert)
        // This leverages the schema validation (uppercase, trim, min: 0)
        const result = await Position.findOneAndUpdate(
          { symbol: symbol.toUpperCase().trim() },
          {
            symbol: symbol.toUpperCase().trim(),
            shares,
            addedAt: addedAt || new Date().toISOString().split('T')[0]
          },
          { upsert: true, returnDocument: 'after', runValidators: true }
        );

        res.status(200).json({ success: true, result });
      } catch (e: any) {
        res.status(500).json({ error: 'Failed to update position', details: e.message });
      }
      break;

    case 'DELETE':
      try {
        const { symbol } = req.query;
        if (typeof symbol === 'string' && symbol.trim() !== '') {
          const result = await Position.deleteOne({ symbol: symbol.toUpperCase().trim() });

          if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Position not found' });
          }

          res.status(200).json({ success: true, message: `${symbol} deleted.` });
        } else {
          // If no specific symbol is provided, clear ALL positions from MongoDB.
          // This matches the "Clear All" behavior in the UI.
          await Position.deleteMany({});
          res.status(200).json({ success: true, message: 'Cleared all positions.' });
        }
      } catch (e: any) {
        res.status(500).json({ error: 'Failed to delete position', details: e.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}