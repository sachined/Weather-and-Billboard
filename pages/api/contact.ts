import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FORMSPREE_ID = process.env.FORMSPREE_ID;

  // 1. Validate environment variable
  if (!FORMSPREE_ID) {
    console.error('FORMSPREE_ID is not defined in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  interface ContactFormData {
      name: string;
      email: string;
      message: string;
      _gotcha: string;
  }

  const { name, email, message }: ContactFormData = req.body;

  // 2. Honeypot check: if filled, silently succeed (don't call Formspree)
  if (_gotcha) {
    return res.status(200).json({ success: true });
  }

  // 3. Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // 4. Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      // 2. Relay more specific error information if available
      res.status(response.status).json({ error: result.error || 'Failed to send message' });
    }
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}