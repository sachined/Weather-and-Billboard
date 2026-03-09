// hooks/usePortfolio.ts
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

  // 1. Initial Load & Detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoc = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocal(isLoc);

      const savedShowResearch = localStorage.getItem('portfolio-show-research');
      if (savedShowResearch !== null) {
        setShowResearch(savedShowResearch === 'true');
      }

      if (isLoc) {
        const saved = localStorage.getItem('portfolio-v1');
        if (saved) {
          try {
            setMyPositions(JSON.parse(saved));
          } catch (e) {
            setMyPositions(CORE_POSITIONS);
          }
        } else {
          setMyPositions(CORE_POSITIONS);
        }
      } else {
        setMyPositions(CORE_POSITIONS);
      }
      setLoading(false);
    }
  }, []);

  // 2. Fetch Prices (Batched)
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

  // Actions
  const updatePosition = useCallback((symbol: string, shares: number) => {
    const ticker = symbol.toUpperCase().trim();
    const existing = myPositions.find(p => p.symbol === ticker);
    const newPos: UserPosition = { 
      symbol: ticker, 
      shares,
      addedAt: existing?.addedAt || new Date().toISOString().split('T')[0]
    };
    const updated = [...myPositions.filter(p => p.symbol !== ticker), newPos];
    setMyPositions(updated);
    localStorage.setItem('portfolio-v1', JSON.stringify(updated));
  }, [myPositions]);

  const removePosition = useCallback((symbol: string) => {
    const updated = myPositions.filter(p => p.symbol !== symbol);
    setMyPositions(updated);
    localStorage.setItem('portfolio-v1', JSON.stringify(updated));
  }, [myPositions]);

  const clearPortfolio = useCallback(() => {
    setMyPositions([]);
    localStorage.removeItem('portfolio-v1');
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