// pages/api/stock.ts
//
// Uses Yahoo Finance v8 chart endpoint — the only YF endpoint that works
// without a crumb/consent cookie. The v7 quote and quoteSummary endpoints
// require a crumb obtained via a GDPR consent redirect chain that Yahoo Finance
// blocks from Vercel's shared IP pool on cold starts.
//
// Dividend data is NOT available here; it is merged client-side from the
// static DIVIDEND_RATES map in portfolio-data.json.

import type { NextApiRequest, NextApiResponse } from 'next';

const YF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

async function fetchQuote(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  const res = await fetch(url, { headers: YF_HEADERS });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`${symbol}: no chart meta`);

  const price = meta.regularMarketPrice as number;
  const prev  = meta.chartPreviousClose as number;
  const changePercent = prev ? ((price - prev) / prev) * 100 : 0;

  return {
    symbol: (meta.symbol as string).toUpperCase(),
    regularMarketPrice: price,
    regularMarketChangePercent: changePercent,
    shortName: (meta.shortName as string) || (meta.longName as string) || symbol,
    // Dividend data omitted — merged client-side from portfolio-data.json
    trailingAnnualDividendRate: 0,
    trailingAnnualDividendYield: 0,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ticker } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'Ticker is required' });
  }

  const symbols = ticker.toUpperCase().split(',').filter(Boolean);

  try {
    if (symbols.length === 1) {
      const quote = await fetchQuote(symbols[0]);
      res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
      return res.status(200).json(quote);
    }

    const settled = await Promise.allSettled(symbols.map(fetchQuote));
    const results = settled
      .filter((r): r is PromiseFulfilledResult<ReturnType<typeof fetchQuote> extends Promise<infer T> ? T : never> => r.status === 'fulfilled')
      .map(r => r.value);

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json(results);
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);
    res.status(500).json({ error: `Internal server error fetching data for ${ticker}` });
  }
}
