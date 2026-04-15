// hooks/usePortfolio.ts
// noinspection ExceptionCaughtLocallyJS

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { UserPosition, Lot, CORE_POSITIONS, getTickerLayer, computePosition, DIVIDEND_RATES } from '@/lib/portfolio-logic';
import { BASE_PATH } from '@/lib/constants';

export function usePortfolio() {
  const [timeRange, setTimeRange] = useState<'all' | '1y'>('all');
  const [showAccumulation, setShowAccumulation] = useState(true);
  const [isLocal, setIsLocal] = useState(false);
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [showResearch, setShowResearch] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [chartEnabled, setChartEnabled] = useState(false);

  const [myPositions, setMyPositions] = useState<UserPosition[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<{
    labels: string[],
    baseData?: number[],
    totalData?: number[],
    data?: number[]
  }>({labels: [], data: []});

  const [totalValue, setTotalValue] = useState(0);
  const [estimatedAnnualIncome, setEstimatedAnnualIncome] = useState(0);
  const [appreciation, setAppreciation] = useState<{ value: number, percent: number }>({value: 0, percent: 0});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cache history responses by mode key to avoid redundant fetches on toggle
  const historyCache = useRef<Record<string, typeof historyData>>({});

  const isAdmin = isLocal || !!adminKey;

  const displayHistoryData = useMemo(() => {
    if (timeRange === 'all' || !historyData.labels.length) return historyData;

  const startIdx = Math.max(0, historyData.labels.length - 12);
  return {
    labels: historyData.labels.slice(startIdx),
    baseData: historyData.baseData?.slice(startIdx),
    totalData: historyData.totalData?.slice(startIdx),
    data: historyData.data?.slice(startIdx)
  };
}, [historyData, timeRange]);

  // Recalculate appreciation for the selected period
  const displayAppreciation = useMemo(() => {
    const performanceData = displayHistoryData.totalData || displayHistoryData.data;
    if (performanceData && performanceData.length >= 2) {
      const startValue = performanceData[0];
      const endValue = performanceData[performanceData.length - 1];
      const diff = endValue - startValue;
      const percent = startValue !== 0 ? (diff / startValue) * 100 : 0;
      return { value: diff, percent };
    }
    return { value: 0, percent: 0 };
  }, [displayHistoryData]);

  // 1. Initial Load & Local UI Preferences
  useEffect(() => {
    const initPortfolio = async () => {
      // Detection for UI features
      if (typeof window !== 'undefined') {
        const isLoc = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        setIsLocal(isLoc);

        // Admin session persistence
        const savedKey = sessionStorage.getItem('portfolio-admin-key');
        if (savedKey) {
          setAdminKey(savedKey);
        }

        // UI preferences like 'showResearch' can stay in localStorage
        const savedShowResearch = localStorage.getItem('portfolio-show-research');
        if (savedShowResearch !== null) {
          setShowResearch(savedShowResearch === 'true');
        }
      }

      try {
        const res = await fetch(`${BASE_PATH}/api/portfolio`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.details || data.error || 'Failed to fetch portfolio');

        // Use database positions if they exist, otherwise fallback to core defaults
        if (Array.isArray(data) && data.length > 0) {
          setMyPositions(data);
        } else {
          setMyPositions(CORE_POSITIONS);
        }
      } catch (err) {
        console.error("Portfolio fetch error:", err);
        setMyPositions(CORE_POSITIONS);
      } finally {
        setLoading(false);
      }
    };

    initPortfolio();
  }, []);

  // Admin key persistence
  useEffect(() => {
    if (adminKey && typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio-admin-key', adminKey);
    }
  }, [adminKey]);

  // 2. Fetch Prices (Batched) - Automatically triggers when myPositions changes
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchAll = async () => {
      if (myPositions.length === 0) {
        setStockData([]);
        setLoading(false);
        return;
      }
      try {
        const tickers = myPositions.filter(p => p.shares > 0).map(p => p.symbol).join(',');
        const res = await fetch(`${BASE_PATH}/api/stock?ticker=${tickers}`, { signal });
        const data = await res.json();

        const mergeStock = (stock: any) => {
          const sym = stock.symbol.toUpperCase();
          const pos = myPositions.find(p => p.symbol.toUpperCase() === sym);
          return {
            ...stock,
            shares: pos ? pos.shares : 0,
            costBasis: pos?.costBasis,
            trailingAnnualDividendRate: DIVIDEND_RATES[sym] ?? 0,
          };
        };

        if (Array.isArray(data)) {
          setStockData(data.map(mergeStock));
        } else if (data && !data.error) {
          setStockData([mergeStock(data)]);
        }
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        console.error("Fetch All Error:", e);
        setError("Failed to fetch market data.");
      }
    };
    fetchAll();

    return () => controller.abort();
  }, [myPositions]);

  // 3. Fetch History & Appreciation
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchHistory = async () => {
      if (!chartEnabled || myPositions.length === 0) return;
      try {
        const filteredPositions = myPositions.filter(p => {
          const layer = getTickerLayer(p.symbol);
          if (layer === 'Closed') return false;
          if (layer === 'Research' && !showResearch) return false;
          return true;
        });

        if (filteredPositions.length === 0) {
          setHistoryData({ labels: [], totalData: [], data: [], baseData: [] });
          setAppreciation({ value: 0, percent: 0 });
          return;
        }

        const cacheKey = `${showAccumulation}-${showResearch}-${filteredPositions.map(p => p.symbol).join(',')}`;
        if (historyCache.current[cacheKey]) {
          setHistoryData(historyCache.current[cacheKey]);
          return;
        }

        const posParam = encodeURIComponent(JSON.stringify(filteredPositions));
        const res = await fetch(`${BASE_PATH}/api/portfolio-history?positions=${posParam}&ignoreDates=${!showAccumulation}`, { signal });
        const data = await res.json();

        if (data.labels && (data.totalData || data.data)) {
          historyCache.current[cacheKey] = data;
          setHistoryData(data);
          const performanceData = data.totalData || data.data;
          if (performanceData && performanceData.length >= 2) {
            const startValue = performanceData[0];
            const endValue = performanceData[performanceData.length - 1];
            const diff = endValue - startValue;
            const percent = startValue !== 0 ? (diff / startValue) * 100 : 0;
            setAppreciation({ value: diff, percent });
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        console.error("Error fetching history:", e);
      }
    };
    fetchHistory();

    return () => controller.abort();
  }, [myPositions, showResearch, showAccumulation, chartEnabled]);

  // 4. Calculate Total Value + Estimated Annual Dividend Income
  useEffect(() => {
    const visible = stockData.filter(s => showResearch || getTickerLayer(s.symbol) !== 'Research');
    const total = visible.reduce((acc, curr) => acc + (curr.regularMarketPrice * curr.shares), 0);
    setTotalValue(total);
    const income = visible.reduce((acc, curr) => {
      const rate = curr.trailingAnnualDividendRate ?? 0;
      return acc + rate * curr.shares;
    }, 0);
    setEstimatedAnnualIncome(income);
  }, [stockData, showResearch]);

  // --- ACTIONS ---

  // Append a lot to an existing position, or create a new position with that lot.
  const updatePosition = useCallback(async (
    symbol: string,
    shares: number,
    date?: string,
    costBasis?: number,
  ) => {
    const ticker = symbol.toUpperCase().trim();
    const today = new Date().toISOString().split('T')[0];
    const newLot: Lot = { shares, date: date || today, ...(costBasis ? { costBasis } : {}) };

    const existing = myPositions.find(p => p.symbol === ticker);
    const updatedLots = existing ? [...existing.lots, newLot] : [newLot];
    const updatedPos = computePosition(ticker, updatedLots);

    try {
      await fetch(`${BASE_PATH}/api/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-key': adminKey || ''
        },
        body: JSON.stringify(updatedPos)
      });

      setMyPositions(prev => {
        const filtered = prev.filter(p => p.symbol !== ticker);
        return [...filtered, updatedPos];
      });
    } catch (e) {
      console.error("Update Position Error:", e);
      setError("Network error updating position.");
    }
  }, [myPositions, adminKey]);

  const removePosition = useCallback(async (symbol: string) => {
    const ticker = symbol.toUpperCase();
    try {
      const res = await fetch(`${BASE_PATH}/api/portfolio?symbol=${ticker}`, {
        method: 'DELETE',
        headers: {
          'admin-key': adminKey || ''
        }
      });

      if (res.ok) {
        setMyPositions(prev => prev.filter(p => p.symbol !== ticker));
      } else {
        setError("Failed to remove position.");
      }
    } catch (e) {
      console.error("Remove Position Error:", e);
      setError("Network error removing position.");
    }
  }, [adminKey]);

  const clearPortfolio = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_PATH}/api/portfolio`, {
        method: 'DELETE',
        headers: {
          'admin-key': adminKey || ''
        }
      });
      if (res.ok) {
        setMyPositions([]);
        setStockData([]);
        setError(null);
      } else {
        setError("Failed to clear portfolio.");
      }
    } catch (e) {
      console.error("Clear Portfolio Error:", e);
      setError("Network error clearing portfolio.");
    }
  }, [adminKey]);

  const toggleResearch = useCallback(() => {
    const newVal = !showResearch;
    setShowResearch(newVal);
    localStorage.setItem('portfolio-show-research', String(newVal));
  }, [showResearch]);

  const toggleClosed = useCallback(() => {
    setShowClosed(prev => !prev);
  }, []);

  return {
    isLocal,
    adminKey,
    setAdminKey,
    isAdmin,
    myPositions,
    stockData,
    historyData: displayHistoryData,
    appreciation: displayAppreciation,
    totalValue,
    estimatedAnnualIncome,
    loading,
    error,
    showResearch,
    showClosed,
    chartEnabled,
    enableChart: () => setChartEnabled(true),
    updatePosition,
    removePosition,
    clearPortfolio,
    toggleResearch,
    toggleClosed,
    showAccumulation,
    toggleAccumulation: () => setShowAccumulation(!showAccumulation),
    timeRange,
    toggleTimeRange: () => setTimeRange(prev => prev === 'all' ? '1y' : 'all'),
  };
}