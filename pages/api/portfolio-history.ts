// pages/api/portfolio-history.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import yahooFinance from '@/lib/yahoo-finance';
import { UserPosition } from '@/lib/portfolio-logic';
import { getPositions } from '@/lib/portfolio-writer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let positions: UserPosition[] = getPositions();
  const { positions: posQuery, ignoreDates } = req.query;
  const shouldIgnoreDates = ignoreDates === 'true';

  if (posQuery && typeof posQuery === 'string') {
    try {
      const parsed = JSON.parse(posQuery);
      if (!Array.isArray(parsed) || parsed.length > 30) {
        return res.status(400).json({ error: 'positions must be an array of at most 30 items' });
      }
      for (const p of parsed) {
        if (typeof p?.symbol !== 'string' || !/^[A-Z0-9.]{1,10}$/i.test(p.symbol)) {
          return res.status(400).json({ error: 'Invalid symbol in positions' });
        }
      }
      positions = parsed;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid positions format' });
    }
  }

  if (!positions || positions.length === 0) {
    return res.status(200).json({ labels: [], baseData: [], totalData: [], data: [] });
  }

  try {

    const startDate = new Date('2021-01-01');

    const promises = positions.map(async (p) => {
      try {
        const result = await yahooFinance.chart(p.symbol.toUpperCase(), {
          period1: startDate,
          interval: '1mo',
        });
        return { 
          symbol: p.symbol, 
          shares: p.shares, 
          addedAt: p.addedAt,
          quotes: result.quotes 
        };
      } catch (error) {
        console.error(`Error fetching chart for ${p.symbol}:`, error);
        return { symbol: p.symbol, shares: p.shares, addedAt: p.addedAt, quotes: [] };
      }
    });

    const results = await Promise.all(promises);

    // Group by date
    const baseTotals: Record<string, number> = {};
    const totalAppreciation: Record<string, number> = {};

    // Find all unique dates and sort them
    const allDates = new Set<string>();
    results.forEach((r) => {
      r.quotes.forEach((q) => {
        if (q.date) {
          const dateStr = new Date(q.date).toISOString().slice(0, 7); // YYYY-MM
          allDates.add(dateStr);
        }
      });
    });

    const sortedDates = Array.from(allDates).sort();

    const finalDates: string[] = [];
    const chartLabels: string[] = [];

    sortedDates.forEach((dateStr) => {
      let baseVal = 0;
      let totalVal = 0;
      
      results.forEach((r) => {
        const quote = r.quotes.find((q) => q.date && new Date(q.date).toISOString().slice(0, 7) === dateStr);
        if (quote && (quote.close || quote.adjclose)) {
          const price = quote.adjclose || quote.close || 0;
          
          // Contribution to base: if no addedAt or it was added on or before the start of our chart
          const startYM = startDate.toISOString().slice(0, 7);
          const isBase = shouldIgnoreDates || !r.addedAt || r.addedAt.slice(0, 7) <= startYM;

          if (isBase) baseVal += price * r.shares;

          if (shouldIgnoreDates || !r.addedAt || dateStr >= r.addedAt.slice(0,7)) {
            totalVal += price * r.shares;
          }
        }
      });

      if (totalVal > 0) {
        baseTotals[dateStr] = baseVal;
        totalAppreciation[dateStr] = totalVal;
        finalDates.push(dateStr);
        chartLabels.push(new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
    });

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.status(200).json({
      labels: chartLabels,
      baseData: finalDates.map(d => baseTotals[d]),
      totalData: finalDates.map(d => totalAppreciation[d]),
    });
  } catch (error) {
    console.error('Portfolio History Error:', error);
    res.status(500).json({ error: 'Internal server error fetching portfolio history' });
  }
}
