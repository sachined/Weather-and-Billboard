// pages/portfolio.tsx
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import styles from '../styles/Portfolio.module.css';
import { StrategySummary } from '../components/Portfolio/StrategySummary';
import { StockRow } from '../components/Portfolio/StockRow';
import { getTickerLayer, PortfolioLayer, LAYER_TARGETS } from '../lib/portfolio-logic';
import { SITE_NAME } from '../lib/constants';
import PortfolioHistoryChart from '../components/Portfolio/PortfolioHistoryChart';
import ArchitectureModal from '../components/Portfolio/ArchitectureModal';
import { usePortfolio } from '../hooks/usePortfolio';

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

  const {
    isLocal,
    myPositions,
    stockData,
    historyData,
    appreciation,
    totalValue,
    loading,
    showResearch,
    updatePosition,
    clearPortfolio,
    toggleResearch
  } = usePortfolio();

  const addOrUpdatePosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    updatePosition(query, quantity);
    setQuery('');
    setQuantity(0);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your portfolio tracker?")) {
      clearPortfolio();
    }
  };

  const renderLayer = (layer: PortfolioLayer) => {
    if (layer === 'Research' && !showResearch) return null;
    const layerStocks = stockData.filter(s => getTickerLayer(s.symbol) === layer);
    if (layerStocks.length === 0 && layer !== 'Research') return null;
    if (layerStocks.length === 0 && layer === 'Research' && stockData.length === 0) return null;

    return (
      <div className={styles.column} key={layer}>
        <div className={styles.columnHeader}>
        <h2>{layer}</h2>
          <span className={styles.targetBadge}>Target: {LAYER_TARGETS[layer]}</span>
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
        ))}
        {layerStocks.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No tickers in {layer}.</p>}
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
                  style={!showResearch ? { opacity: 0.6, marginRight: '1rem' } : { marginRight: '1rem' }}
                >
                  {showResearch ? 'Exclude Research' : 'Include Research'}
                </button>
              )}
              <div className={styles.techTooltip}>
                <span role="img" aria-label="info">ℹ️</span> <span>Real-time market data.</span>
              </div>
              {isLocal && (
                <button onClick={handleClear} className={styles.viewSource} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 1rem' }}>
                  Clear All
                </button>
              )}
            </div>
        </div>

        <StrategySummary />

        <div className={styles.searchSection}>
          {isLocal && (
            <form onSubmit={addOrUpdatePosition} style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
              <h3>1-Year Performance</h3>
              <p>Visualization of portfolio growth and capital appreciation over the last 12 months.</p>
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
          {stockData.some(s => getTickerLayer(s.symbol) === 'Research') && renderLayer('Research')}
        </main>
        <ArchitectureModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />

        {!loading && stockData.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
            <p>No tickers added yet. Start by adding a ticker above.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}