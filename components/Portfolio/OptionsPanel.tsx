// components/Portfolio/OptionsPanel.tsx
import styles from '@/styles/Portfolio.module.css';
import type { PortfolioOption, UserPosition } from '@/lib/portfolio-logic';
import { isSpread, netCredit, maxLoss, breakeven } from '@/lib/portfolio-logic';

interface OptionsPanelProps {
  options: PortfolioOption[];
  positions?: UserPosition[];
}

function displayStrike(opt: PortfolioOption, spread: boolean): string {
  if (spread) {
    return `$${opt.shortStrike!.toFixed(2)} / $${opt.longStrike!.toFixed(2)}`;
  }
  return `$${opt.strike!.toFixed(2)}`;
}

function getAnnotation(opt: PortfolioOption, shares: number): string {
  const contractShares = opt.contracts * 100;

  if (isSpread(opt)) {
    const be = breakeven(opt);
    if (be === null) return '';
    return opt.type === 'call'
      ? `profitable if ${opt.underlying} stays below $${be.toFixed(2)} at expiry`
      : `profitable if ${opt.underlying} stays above $${be.toFixed(2)} at expiry`;
  }

  if (opt.type === 'call' && opt.direction === 'short') {
    const uncapped = shares - contractShares;
    if (uncapped > 0) {
      return `covers ${contractShares} of ${shares} shares — ${uncapped} remain uncapped above $${opt.strike}`;
    }
    return `covers all ${shares} shares — full position capped at $${opt.strike}`;
  }

  if (opt.type === 'put' && opt.direction === 'short') {
    if (shares <= 5) {
      return `assignment initiates ${contractShares}-share position at $${opt.strike} (currently ${shares} share${shares === 1 ? '' : 's'})`;
    }
    return `assignment adds ${contractShares} shares to current ${shares}-share position at $${opt.strike}`;
  }

  return '';
}

function getDTE(expiry: string): number {
  const expiryMs = new Date(expiry + 'T00:00:00').getTime();
  return Math.ceil((expiryMs - Date.now()) / 86_400_000);
}

function formatExpiry(expiry: string): string {
  return new Date(expiry + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const OptionsPanel = ({ options, positions = [] }: OptionsPanelProps) => {
  const openOptions = options.filter(o => o.status === 'open');
  if (openOptions.length === 0) return null;

  const totalCredit = openOptions.reduce(
    (sum, o) => sum + netCredit(o) * o.contracts * 100,
    0
  );

  return (
    <div className={styles.optionsPanel}>
      <div className={styles.optionsPanelHeader}>
        <span className={styles.optionsPanelTitle}>Open Options</span>
        <span className={styles.optionsPanelCount}>{openOptions.length}</span>
      </div>

      <div className={styles.optionsList}>
        {openOptions.map((opt, i) => {
          const dte = getDTE(opt.expiry);
          const credit = opt.premiumReceived * opt.contracts * 100;
          const isCall = opt.type === 'call';
          const spread = isSpread(opt);
          const equityShares = positions.find(
            p => p.symbol.toUpperCase() === opt.underlying.toUpperCase()
          )?.shares ?? 0;
          const annotation = equityShares > 0 ? getAnnotation(opt, equityShares) : '';

          return (
            <div key={i} className={styles.optionRow}>
              <div className={styles.optionLeft}>
                <span className={`${styles.optionSymbol} ${isCall ? styles.optionCall : styles.optionPut}`}>
                  {opt.underlying}
                </span>
                <span className={styles.optionStrategy}>{opt.strategy}</span>
              </div>

              <div className={styles.optionDetails}>
                <span className={styles.optionChip}>
                  {displayStrike(opt, spread)} {spread ? 'spread' : opt.type}
                </span>
                <span className={styles.optionChip}>{formatExpiry(opt.expiry)}</span>
                <span className={`${styles.optionChip} ${dte <= 21 ? styles.dteWarning : ''}`}>
                  {dte} DTE
                </span>
                <span className={styles.optionChip}>
                  {opt.contracts} {opt.contracts === 1 ? 'contract' : 'contracts'}
                </span>
              </div>

              <div className={styles.optionCredit}>
                +${credit.toFixed(2)}
              </div>

              {annotation && (
                <div className={styles.optionAnnotation}>{annotation}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.optionsFooter}>
        <span className={styles.optionsFooterLabel}>Total Net Credit</span>
        <span className={styles.optionsFooterValue}>+${totalCredit.toFixed(2)}</span>
      </div>
    </div>
  );
};
