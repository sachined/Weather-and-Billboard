// hooks/usePortfolio.ts
// noinspection ExceptionCaughtLocallyJS

import { useState, useEffect, useCallback } from 'react';
import { UserPosition, CORE_POSITIONS, getTickerLayer } from '../lib/portfolio-logic';

export function usePortfolio() {
  const [isLocal, setIsLocal] = useState(false);
  const [myPositions, setMyPositions] = useState<UserPosition[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<{ labels: string[], baseData?: number[], totalData?: number[], data?: number[] }>({ labels: [], data: [] });
  const [appreciation, setAppreciation] = useState<{ value: number, percent: number }>({ value: 0, percent: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [totalValue, setTotalValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showResearch, setShowResearch] = useState(true);

  // 1. Initial Load from MongoDB & Local UI Preferences
  useEffect(() => {
    const initPortfolio = async () => {
      // Detection for UI features
      if (typeof window !== 'undefined') {
        const isLoc = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        setIsLocal(isLoc);

        // UI preferences like 'showResearch' can stay in localStorage
        const savedShowResearch = localStorage.getItem('portfolio-show-research');
        if (savedShowResearch !== null) {
          setShowResearch(savedShowResearch === 'true');
        }
      }

      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error('Failed to fetch from MongoDB');

        const data = await res.json();

        // Use database positions if they exist, otherwise fallback to core defaults
        if (Array.isArray(data) && data.length > 0) {
          setMyPositions(data);
        } else {
          setMyPositions(CORE_POSITIONS);
        }
      } catch (err) {
        console.error("MongoDB Load Error, falling back to CORE_POSITIONS:", err);
        setMyPositions(CORE_POSITIONS);
        setError("Note: Using local fallback data. Check MongoDB connection.");
      } finally {
        setLoading(false);
      }
    };

    initPortfolio();
  }, []);

  // 2. Fetch Prices (Batched) - Automatically triggers when myPositions changes
  useEffect(() => {
    const fetchAll = async () => {
      if (myPositions.length === 0) {
        setStockData([]);
        return;
      }
      try {
        const tickers = myPositions.map(p => p.symbol).join(',');
        const res = await fetch(`/api/stock?ticker=${tickers}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const merged = data.map(stock => {
            const pos = myPositions.find(p => p.symbol.toUpperCase() === stock.symbol.toUpperCase());
            return { ...stock, shares: pos ? pos.shares : 0 };
          });
          setStockData(merged);
        } else if (data && !data.error) {
          const pos = myPositions.find(p => p.symbol.toUpperCase() === data.symbol.toUpperCase());
          setStockData([{ ...data, shares: pos ? pos.shares : 0 }]);
        }
      } catch (e) {
        console.error("Fetch All Error:", e);
        setError("Failed to fetch market data.");
      }
    };
    fetchAll();
  }, [myPositions]);

  // 3. Fetch History & Appreciation
  useEffect(() => {
    const fetchHistory = async () => {
      if (myPositions.length === 0) return;
      try {
        const filteredPositions = showResearch
          ? myPositions
          : myPositions.filter(p => getTickerLayer(p.symbol) !== 'Research');

        if (filteredPositions.length === 0) {
          setHistoryData({ labels: [], totalData: [], data: [], baseData: [] });
          setAppreciation({ value: 0, percent: 0 });
          return;
        }

        const posParam = encodeURIComponent(JSON.stringify(filteredPositions));
        const res = await fetch(`/api/portfolio-history?positions=${posParam}`);
        const data = await res.json();

        if (data.labels && (data.totalData || data.data)) {
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
      } catch (e) {
        console.error("Error fetching history:", e);
      }
    };
    fetchHistory();
  }, [myPositions, showResearch]);

  // 4. Calculate Total Value
  useEffect(() => {
    const total = stockData
      .filter(s => showResearch || getTickerLayer(s.symbol) !== 'Research')
      .reduce((acc, curr) => acc + (curr.regularMarketPrice * curr.shares), 0);
    setTotalValue(total);
  }, [stockData, showResearch]);

  // --- ACTIONS (MongoDB Integrated) ---

  const updatePosition = useCallback(async (symbol: string, shares: number) => {
    const ticker = symbol.toUpperCase().trim();
    const existing = myPositions.find(p => p.symbol === ticker);
    const addedAt = existing?.addedAt || new Date().toISOString().split('T')[0];

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: ticker, shares, addedAt })
      });

      if (res.ok) {
        const newPos: UserPosition = { symbol: ticker, shares, addedAt };
        setMyPositions(prev => {
          const filtered = prev.filter(p => p.symbol !== ticker);
          return [...filtered, newPos];
        });
      } else {
        setError("Failed to sync update with MongoDB.");
      }
    } catch (e) {
      console.error("Update Position Error:", e);
      setError("Network error updating position.");
    }
  }, [myPositions]);

  const removePosition = useCallback(async (symbol: string) => {
    const ticker = symbol.toUpperCase();
    try {
      const res = await fetch(`/api/portfolio?symbol=${ticker}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMyPositions(prev => prev.filter(p => p.symbol !== ticker));
      } else {
        setError("Failed to remove position from MongoDB.");
      }
    } catch (e) {
      console.error("Remove Position Error:", e);
      setError("Network error removing position.");
    }
  }, []);

  const clearPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'DELETE'
      });
      if (res.ok) {
        setMyPositions([]);
        setStockData([]);
        setError(null);
      } else {
        setError("Failed to clear portfolio from MongoDB.");
      }
    } catch (e) {
      console.error("Clear Portfolio Error:", e);
      setError("Network error clearing portfolio.");
    }
  }, []);

  const toggleResearch = useCallback(() => {
    const newVal = !showResearch;
    setShowResearch(newVal);
    localStorage.setItem('portfolio-show-research', String(newVal));
  }, [showResearch]);

  return {
    isLocal,
    myPositions,
    stockData,
    historyData,
    appreciation,
    totalValue,
    loading,
    error,
    showResearch,
    updatePosition,
    removePosition,
    clearPortfolio,
    toggleResearch
  };
}