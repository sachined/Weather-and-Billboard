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
  const [costBasisInput, setCostBasisInput] = useState<string>('');
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
    estimatedAnnualIncome,
    loading,
    error,
    showResearch,
    chartEnabled,
    enableChart,
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
    const cb = costBasisInput !== '' ? Number(costBasisInput) : undefined;
    updatePosition(query, Number(quantity), cb);
    setQuery('');
    setQuantity(0);
    setCostBasisInput('');
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

  // Real portfolio value: Anchor + Growth + Income + Asymmetric (excludes Research simulation)
  const coreValue = stockData
    .filter(s => getTickerLayer(s.symbol) !== 'Research')
    .reduce((acc, curr) => acc + (curr.regularMarketPrice * curr.shares), 0);

  // Research = simulation layer only (user-added watchlist tickers)
  const hasResearchPositions = myPositions.some(p => getTickerLayer(p.symbol) === 'Research');
  const researchValue = stockData
    .filter(s => getTickerLayer(s.symbol) === 'Research')
    .reduce((acc, s) => acc + (s.regularMarketPrice * s.shares), 0);

  const LAYER_CLASS: Record<PortfolioLayer, string> = {
    Anchor:     styles.columnAnchor,
    Growth:     styles.columnGrowth,
    Income:     styles.columnIncome,
    Asymmetric: styles.columnAsymmetric,
    Research:   styles.columnResearch,
  };

  const renderLayer = (layer: PortfolioLayer) => {

    if (layer === 'Research' && !showResearch) return null;
    const layerStocks = stockData.filter(s => getTickerLayer(s.symbol) === layer);

    // Calculate Actual Ratio
    const layerValue = layerStocks.reduce((acc, s) => acc + (s.regularMarketPrice * s.shares), 0);
    // Research is simulation: show % of simulated total (real + research). All other layers use real portfolio value.
    const denominator = (layer === 'Research') ? (coreValue + researchValue) : coreValue;
    const actualRatio = denominator > 0 ? (layerValue / denominator) * 100 : 0;

    const targetStr = LAYER_TARGETS[layer];
    const targetMax = targetStr === 'N/A'
      ? Infinity
      : parseFloat(targetStr.split('-').pop() || '0');

    const isOverTarget = actualRatio > targetMax;

    if (layerStocks.length === 0 && layer !== 'Research') return null;

    const researchRatio = (coreValue + researchValue) > 0
      ? ((layerValue / (coreValue + researchValue)) * 100).toFixed(1)
      : '0.0';

    return (
      <div className={`${styles.column} ${LAYER_CLASS[layer]}`} key={layer}>
        <div className={styles.columnHeader}>
          <h2>{layer}</h2>
          <div className={styles.ratioBadges}>
            <span className={styles.targetBadge}>Target: {targetStr}</span>
            <span className={`${styles.actualBadge} ${isOverTarget ? styles.actualBadgeWarning : styles.actualBadgeSuccess}`}>
              Actual: {actualRatio.toFixed(1)}%
            </span>
          </div>
        </div>
        {layer !== 'Research' && hasResearchPositions && researchValue > 0 && layerValue > 0 && (
          <div className={styles.researchBadgeRow}>
            <span
              className={styles.researchBadge}
              title={`${layer} ($${layerValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}) is ${researchRatio}% of your full portfolio including Research ($${(coreValue + researchValue).toLocaleString(undefined, { maximumFractionDigits: 0 })} total). The Actual % above excludes Research.`}
            >
              {layer}: {researchRatio}% of total (incl. Research)
            </span>
          </div>
        )}
        {layerStocks.map(s => (
          <StockRow
            key={s.symbol}
            symbol={s.symbol}
            price={s.regularMarketPrice}
            name={s.shortName}
            change={s.regularMarketChangePercent}
            shares={s.shares}
            costBasis={s.costBasis}
            totalPortfolioValue={totalValue}
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
        <header className={styles.header}>
          <p className={styles.pageEyebrow}>Growth Strategy</p>
          <h1 className={styles.heroStatement}>Long-horizon. Conviction-driven.</h1>
          <p className={styles.heroSupport}>
            A layered portfolio tracker built around patient investing principles — real positions, live prices, and allocation targets in one place.
          </p>
          {!loading && totalValue > 0 && (
            <div className={styles.heroStats}>
              <div className={styles.heroStatItem}>
                <span className={styles.heroStatLabel}>Portfolio Value</span>
                <span className={styles.heroStatValue}>
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {appreciation.value !== 0 && (
                <div className={styles.heroStatItem}>
                  <span className={styles.heroStatLabel}>{timeRange === 'all' ? 'Overall' : 'Annual'} Return</span>
                  <span className={`${styles.heroStatReturn} ${appreciation.value >= 0 ? styles.heroStatPositive : styles.heroStatNegative}`}>
                    {appreciation.value >= 0 ? '+' : ''}${Math.abs(appreciation.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className={styles.heroStatPercent}>
                      ({appreciation.percent >= 0 ? '+' : ''}{appreciation.percent.toFixed(2)}%)
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}
        </header>

        <div className={styles.topBar}>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.infoButton}
          >
            How it&apos;s built
          </button>
          <div className={styles.topBarRight}>
            {hasResearchPositions && (
              <button
                onClick={toggleResearch}
                className={styles.toggleButton}
                style={!showResearch ? { opacity: 0.6 } : {}}
              >
                {showResearch ? 'Hide Simulation' : 'Show Simulation'}
              </button>
            )}
{isAdmin && (
              <button onClick={handleClear} className={styles.clearButton}>
                Clear All
              </button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <div className={styles.adminLoginSection}>
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

        {isAdmin && (
          <div className={styles.searchSection}>
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
              <input
                className={styles.glassInputShort}
                type="number"
                step="0.01"
                value={costBasisInput}
                onChange={e => setCostBasisInput(e.target.value)}
                placeholder="Avg cost"
                aria-label="Average cost per share (optional)"
                title="Average cost per share — used to calculate unrealized P&L"
              />
              <button type="submit" className={styles.addButton}>Update Portfolio</button>
            </form>
          </div>
        )}

        {estimatedAnnualIncome > 0 && (
          <div className={styles.dividendCard}>
            <div className={styles.dividendMain}>
              <span className={styles.dividendLabel}>Estimated Annual Dividend Income</span>
              <span className={styles.dividendAmount}>
                ${estimatedAnnualIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className={styles.dividendNote}>
              Based on trailing 12-month dividend rates × current share counts. Does not include reinvestment or special dividends.
            </p>
          </div>
        )}

        {!chartEnabled ? (
          <div className={styles.chartPlaceholder}>
            <button onClick={enableChart} className={styles.toggleButton}>
              Show Performance Chart
            </button>
            <p>5-year portfolio history — loaded on demand.</p>
          </div>
        ) : historyData.labels.length > 0 ? (
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <div>
                <h3>Portfolio Performance</h3>
                <p className={styles.chartSubtitle}>
                  {showAccumulation
                    ? 'Real Growth — each position is counted only from the date it was actually added.'
                    : 'Fixed Holdings — all positions treated as if held since Jan 2021 (shows pure price appreciation).'}
                  {' '}
                  {timeRange === '1y' ? 'Showing last 12 months.' : 'Showing all time.'}
                </p>
              </div>
              <div className={styles.chartControls}>
                <button onClick={toggleTimeRange} className={styles.toggleButton}>
                  {timeRange === 'all' ? 'Last Year' : 'All Time'}
                </button>
                <button onClick={toggleAccumulation} className={styles.toggleButton}>
                  {showAccumulation ? 'Fixed Holdings' : 'Real Growth'}
                </button>
              </div>
            </div>
            <PortfolioHistoryChart
              labels={historyData.labels}
              baseData={historyData.baseData}
              totalData={historyData.totalData}
              data={historyData.data}
            />
          </div>
        ) : (
          <div className={styles.chartPlaceholder}>
            <p>Loading chart…</p>
          </div>
        )}

        <details className={styles.legendBox}>
          <summary className={styles.legendSummary}>Layer guide</summary>
          <div className={styles.legendBody}>
            <div className={styles.legendSection}>
              <h4>Portfolio Layers</h4>
              <ul>
                <li><strong>Anchor</strong> — Core long-term holdings. High conviction, broad exposure. Target allocation is shown in the column header badge.</li>
                <li><strong>Growth</strong> — Higher-upside positions with more volatility tolerance.</li>
                <li><strong>Income</strong> — Dividend-generating holdings tracked for yield.</li>
                <li><strong>Asymmetric</strong> — High-conviction speculative bets held as real positions. Counted in portfolio value, history, and allocation math. Higher risk, longer time horizon.</li>
                <li><strong>Research</strong> — Simulated watchlist. These tickers are <em>not</em> counted in your real portfolio value or performance chart. Toggle &ldquo;Show Simulation&rdquo; to see what your portfolio would look like if they were real.</li>
              </ul>
            </div>
            <div className={styles.legendSection}>
              <h4>Column Header Badges</h4>
              <ul>
                <li><strong>Target</strong> — Desired allocation range for that layer (set in strategy config).</li>
                <li><strong>Actual</strong> — Current allocation. Green = within target, amber = over target.</li>
                <li><strong>[Layer]: X% of total (incl. Research)</strong> — Appears when you have a Research simulation active. Shows what share of your <em>simulated</em> total (real + Research) that layer represents. Hover for exact dollar amounts. The Actual % above always uses only your real portfolio.</li>
              </ul>
            </div>
            <div className={styles.legendSection}>
              <h4>Per-Stock Badges</h4>
              <ul>
                <li><strong>Weight %</strong> — Small pill next to share count. Each position&rsquo;s market value as a percentage of the total visible portfolio.</li>
                <li><strong>Unrealized P&amp;L</strong> — Shown below the stock row when an average cost basis is recorded. Positive = green, negative = red. Formula: (current price − avg cost) × shares.</li>
              </ul>
            </div>
          </div>
        </details>

        <main className={styles.grid}>
          {renderLayer('Anchor')}
          {renderLayer('Growth')}
          {renderLayer('Income')}
          {renderLayer('Asymmetric')}
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

        <figure className={styles.pageCloser}>
          <blockquote className={styles.pageCloserText}>
            &ldquo;Everything is worth it if the soul is not small.&rdquo;
          </blockquote>
          <figcaption className={styles.pageCloserAttribution}>
            — Fernando Pessoa, <em>Mar Português</em>
          </figcaption>
        </figure>
      </div>
    </Layout>
  );
}