// components/Portfolio/StockRow.tsx
import styles from '@/styles/Portfolio.module.css';
import { getTickerThesis, getTickerTrigger } from '@/lib/portfolio-logic';
import { useState } from 'react';

interface StockRowProps {
  symbol: string;
  price: number;
  name: string;
  change: number;
  shares: number;
  costBasis?: number;
  totalPortfolioValue: number;
}

export const StockRow = ({ symbol, price, name, change, shares, costBasis, totalPortfolioValue }: StockRowProps) => {
  const [showThesis, setShowThesis] = useState(false);
  const triggerMessage = getTickerTrigger(symbol, price);
  const thesis = getTickerThesis(symbol);
  const marketValue = price * shares;
  const weight = totalPortfolioValue > 0 ? (marketValue / totalPortfolioValue) * 100 : 0;

  const hasPL = costBasis !== undefined && costBasis > 0;
  const plPerShare = hasPL ? price - costBasis! : 0;
  const plTotal = plPerShare * shares;
  const plPercent = hasPL ? (plPerShare / costBasis!) * 100 : 0;
  const plPositive = plTotal >= 0;

  return (
    <div className={styles.stockRow}>
      <div className={styles.rowMain} onClick={() => setShowThesis(!showThesis)}>
        <div className={styles.symbolCol}>
          <span className={styles.symbolText}>{symbol}</span>
          <span className={styles.nameText}>{name}</span>
        </div>

        <div className={styles.priceCol}>
          <div className={styles.priceText}>${price.toFixed(2)}</div>
          <div className={change >= 0 ? styles.positiveText : styles.negativeText}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </div>
        </div>

        <div className={styles.holdingsCol}>
          <div className={styles.valueText}>
            ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={styles.sharesRow}>
            <span className={styles.sharesText}>{shares} SH</span>
            <span className={styles.weightBadge}>{weight.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {hasPL && (
        <div className={`${styles.plRow} ${plPositive ? styles.plPositive : styles.plNegative}`}>
          <span className={styles.plLabel}>Unrealized P&amp;L</span>
          <span>
            {plPositive ? '+' : ''}${Math.abs(plTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {' '}({plPositive ? '+' : ''}{plPercent.toFixed(2)}%)
          </span>
          <span className={styles.plBasis}>avg cost ${costBasis!.toFixed(2)}</span>
        </div>
      )}

      {triggerMessage && (
        <div className={styles.rowAlert}>
          🚨 {triggerMessage}
        </div>
      )}

      {showThesis && thesis && (
        <div className={styles.rowThesis}>
          <strong>Thesis:</strong> {thesis}
        </div>
      )}
    </div>
  );
};
