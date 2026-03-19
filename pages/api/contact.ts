import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FORMSPREE_ID = process.env.FORMSPREE_ID;
  if (!FORMSPREE_ID) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { name, email, message, _gotcha } = req.body;

  if (_gotcha) return res.status(200).json({ success: true });

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    if (response.ok) {
      return res.status(200).json({ success: true });
    }
    return res.status(response.status).json({ error: result.error || 'Failed to send message' });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
