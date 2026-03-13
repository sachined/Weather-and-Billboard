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
}

export const StockRow = ({ symbol, price, name, change, shares }: StockRowProps) => {
  const [showThesis, setShowThesis] = useState(false);
  const triggerMessage = getTickerTrigger(symbol, price);
  const thesis = getTickerThesis(symbol);
  const marketValue = price * shares;

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
          <div className={styles.valueText}>${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={styles.sharesText}>{shares} SH</div>
        </div>
      </div>

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