import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { type, params } = req.query;

  if (!type || !params || typeof type !== 'string' || typeof params !== 'string') {
    return res.status(400).json({ error: 'Missing type or params' });
  }
  if (!['weather', 'forecast'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'Weather API not configured' });
  }

  const upstream = await fetch(`${BASE_URL}/${type}?${params}&appid=${API_KEY}`);
  const data = await upstream.json();
  res.status(upstream.status).json(data);
}
