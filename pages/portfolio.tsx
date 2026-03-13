// pages/portfolio.tsx
import { useState } from 'react';
import type { SubmitEventHandler } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import styles from '@/styles/Portfolio.module.css';
import { StrategySummary } from '@/components/Portfolio/StrategySummary';
import { StockRow } from '@/components/Portfolio/StockRow';
import { getTickerLayer, PortfolioLayer, LAYER_TARGETS } from '@/lib/portfolio-logic';
import { SITE_NAME } from '@/lib/constants';
import PortfolioHistoryChart from '@/components/Portfolio/PortfolioHistoryChart';
import ArchitectureModal from '@/components/Portfolio/ArchitectureModal';
import { usePortfolio } from '@/hooks/usePortfolio';

interface StockData {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  shortName: string;
  shares: number;
}

export default function PortfolioPage() {
  const [query, setQuery] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const {
    isLocal,
    adminKey,
    setAdminKey,
    isAdmin,
    myPositions,
    stockData,
    historyData,
    appreciation,
    totalValue,
    loading,
    error,
    showResearch,
    updatePosition,
    clearPortfolio,
    toggleResearch,
    showAccumulation,
    toggleAccumulation,
    timeRange,
    toggleTimeRange,
  } = usePortfolio();

  const addOrUpdatePosition: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!query) return;
    updatePosition(query, Number(quantity));
    setQuery('');
    setQuantity(0);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your portfolio tracker?")) {
      clearPortfolio();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminKey(passwordInput);
    setShowLogin(false);
  };

  const coreValue = stockData
      .filter(s => getTickerLayer(s.symbol) !== 'Research')
      .reduce((acc, curr) => acc + (curr.regularMarketPrice * curr.shares), 0);

  const renderLayer = (layer: PortfolioLayer) => {

    if (layer === 'Research' && !showResearch) return null;
    const layerStocks = stockData.filter(s => getTickerLayer(s.symbol) === layer);

    // Calculate Actual Ratio
    const layerValue = layerStocks.reduce((acc, s) => acc + (s.regularMarketPrice * s.shares), 0);
    const denominator = (layer === 'Research') ? totalValue : coreValue;
    const actualRatio = denominator > 0 ? (layerValue / denominator) * 100 : 0;

    const targetStr = LAYER_TARGETS[layer];
    const targetMax = targetStr === 'N/A'
      ? Infinity
      : parseFloat(targetStr.split('-').pop() || '0');

    const isOverTarget = actualRatio > targetMax;

    if (layerStocks.length === 0 && layer !== 'Research') return null;

    return (
      <div className={styles.column} key={layer}>
        <div className={styles.columnHeader}>
          <h2>{layer}</h2>
          <div className={styles.ratioGroup}>
          <span className={styles.targetBadge}>Target: {targetStr}</span>
            <span className={`${styles.actualBadge} ${isOverTarget ? styles.actualBadgeWarning : styles.actualBadgeSuccess}`}>
              Actual: {actualRatio.toFixed(1)}%
            </span>
          </div>
        </div>
        {layerStocks.map(s => (
          <StockRow 
            key={s.symbol}
            symbol={s.symbol}
            price={s.regularMarketPrice}
            name={s.shortName}
            change={s.regularMarketChangePercent}
            shares={s.shares}
          />
        )
        )}
        {layerStocks.length === 0 && <p className={styles.noTickers}>No tickers in {layer}.</p>}
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>{`Portfolio Strategy - ${SITE_NAME}`}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.infoButton}
          >
            ℹ️ System Architecture
          </button>
          <div className={styles.topBarRight}>
            {myPositions.some(p => getTickerLayer(p.symbol) === 'Research') && (
              <button
                onClick={toggleResearch}
                className={styles.toggleButton}
                style={!showResearch ? { opacity: 0.6 } : {}}
              >
                {showResearch ? 'Exclude Research' : 'Include Research'}
              </button>
            )}
            <div className={styles.techTooltip}>
              <span role="img" aria-label="info">ℹ️</span> <span>Real-time market data.</span>
            </div>
            {isAdmin && (
              <button onClick={handleClear} className={styles.clearButton}>
                Clear All
              </button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button onClick={() => setShowLogin(!showLogin)} className={styles.infoButton}>
              {showLogin ? 'Cancel' : 'Admin Login'}
            </button>
            {showLogin && (
              <form onSubmit={handleLogin} style={{ marginTop: '0.5rem' }}>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Admin Key"
                  className={styles.glassInputShort}
                />
                <button type="submit" className={styles.addButton}>Login</button>
              </form>
            )}
          </div>
        )}

        <StrategySummary />

        {error && (
          <div className={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.searchSection}>
          {isAdmin && (
            <form onSubmit={addOrUpdatePosition} className={styles.searchForm}>
              <input 
                className={styles.glassInput} 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Ticker (e.g. MSFT)" 
                aria-label="Stock Ticker"
              />
              <input 
                className={styles.glassInputShort} 
                type="number" 
                value={quantity || ''} 
                onChange={e => setQuantity(Number(e.target.value))} 
                placeholder="Shares" 
                aria-label="Quantity"
              />
              <button type="submit" className={styles.addButton}>Update Portfolio</button>
            </form>
          )}
          <div className={styles.portfolioStats}>
            <div className={styles.statGroup}>
              <span className={styles.totalValueLabel}>Total Portfolio Value</span>
              <span className={styles.totalValueAmount}>
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {appreciation.value !== 0 && (
              <div className={styles.statGroup}>
                <span className={styles.totalValueLabel}>Annual Appreciation</span>
                <span className={`${styles.appreciationValue} ${appreciation.value >= 0 ? styles.positive : styles.negative}`}>
                  {appreciation.value >= 0 ? '+' : ''}${Math.abs(appreciation.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className={styles.appreciationPercent}>
                    ({appreciation.percent >= 0 ? '+' : ''}{appreciation.percent.toFixed(2)}%)
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {(historyData.totalData || historyData.data) && historyData.labels.length > 0 && (
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h3>Portfolio Performance</h3>
              <button onClick={toggleTimeRange} className={styles.toggleButton}>
                {timeRange === 'all' ? 'View Last Year' : 'View All Time'}
              </button>
              <button onClick={toggleAccumulation} className={styles.toggleButton}>
                {showAccumulation ? 'View as Fixed Holdings' : 'View Real Growth'}
              </button>
            </div>
            <PortfolioHistoryChart 
              labels={historyData.labels} 
              baseData={historyData.baseData}
              totalData={historyData.totalData}
              data={historyData.data} 
            />
          </div>
        )}

        <main className={styles.grid}>
          {renderLayer('Anchor')}
          {renderLayer('Growth')}
          {renderLayer('Income')}
          {renderLayer('Research')}
        </main>
        <ArchitectureModal isOpen={isModalOpen} onClose={() =>
            setIsModalOpen(false)}
        />
        {!loading && stockData.length === 0 && (
          <div className={styles.emptyState}>
            <p>No tickers added yet. Start by adding a ticker above.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}