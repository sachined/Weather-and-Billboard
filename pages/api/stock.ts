// pages/api/stock.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ticker } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'Ticker is required' });
  }

  try {
    const symbols = ticker.toUpperCase().split(',').filter(Boolean);
    
    if (symbols.length > 1) {
      const quotes = await yahooFinance.quote(symbols);
      // Ensure we return the essential data in a consistent format
      const results = quotes.map(quote => ({
        symbol: quote.symbol,
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChangePercent: quote.regularMarketChangePercent,
        shortName: quote.shortName || quote.longName || quote.symbol,
      }));
      return res.status(200).json(results);
    }

    const quote = await yahooFinance.quote(symbols[0]);
    if (!quote) {
      return res.status(404).json({ error: `No data found for ${ticker}` });
    }
    
    res.status(200).json({
      symbol: quote.symbol,
      regularMarketPrice: quote.regularMarketPrice,
      regularMarketChangePercent: quote.regularMarketChangePercent,
      shortName: quote.shortName || quote.longName || quote.symbol,
    });
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);
    res.status(500).json({ error: `Internal server error fetching data for ${ticker}` });
  }
}