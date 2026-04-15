import portfolioData from './portfolio-data.json';

export type PortfolioLayer = 'Anchor' | 'Growth' | 'Income' | 'Asymmetric' | 'Research' | 'Closed';

export interface Lot {
  shares: number;
  date: string;       // YYYY-MM-DD
  costBasis?: number; // price per share at purchase
}

export interface StrategyAllocation {
  name: string;
  target: string;
  focus: string;
}

export interface StrategyMetrics {
  philosophy: string;
  objective: string;
  allocations: StrategyAllocation[];
  rules: string[];
}

export interface TickerMetadata {
  layer: PortfolioLayer;
  status: 'active' | 'closed';
  thesis?: string;
}

export interface StockTrigger {
  referencePrice: number;
  dipTrigger: number;
  message: string;
}

export interface UserPosition {
  symbol: string;
  shares: number;     // sum of all lot shares
  addedAt?: string;   // earliest lot date
  costBasis?: number; // weighted average cost basis across lots
  lots: Lot[];        // source of truth — individual purchases
}

export interface PortfolioOption {
  underlying: string;
  strategy: string;
  type: 'put' | 'call';
  direction: 'short' | 'long';
  strike?: number;
  shortStrike?: number;
  longStrike?: number;
  expiry: string;          // YYYY-MM-DD
  contracts: number;
  premiumReceived: number; // per share (× 100 for total credit per contract)
  premiumPaid?: number;
  openDate: string;        // YYYY-MM-DD
  closeDate?: string;      //
  status: 'open' | 'closed' | 'expired' | 'assigned';
}

interface RawPosition {
  symbol: string;
  lots: Lot[];
}

export function computePosition(symbol: string, lots: Lot[]): UserPosition {
  const totalShares = Math.max(0, lots.reduce((sum, l) => sum + l.shares, 0));

  const addedAt = lots.reduce((earliest: string, l) =>
    !earliest || l.date < earliest ? l.date : earliest, '');

  const lotsWithBasis = lots.filter(l => l.costBasis !== undefined && l.costBasis > 0);
  let costBasis: number | undefined;
  if (lotsWithBasis.length > 0) {
    const weightedSum = lotsWithBasis.reduce((sum, l) => sum + l.costBasis! * l.shares, 0);
    const basisShares = lotsWithBasis.reduce((sum, l) => sum + l.shares, 0);
    costBasis = weightedSum / basisShares;
  }

  return {
    symbol,
    shares: totalShares,
    addedAt: addedAt || undefined,
    costBasis,
    lots,
  };
}

const rawPositions = portfolioData.corePositions as unknown as RawPosition[];

export const CORE_POSITIONS: UserPosition[] = rawPositions.map(r =>
  computePosition(r.symbol, r.lots)
);

export const PORTFOLIO_OPTIONS: PortfolioOption[] =
  (portfolioData as unknown as { options?: PortfolioOption[] }).options ?? [];

export const PORTFOLIO_STRATEGY = portfolioData.strategy;
export const STRATEGY_METRICS = portfolioData.metrics as StrategyMetrics;
export const LAYER_TARGETS: Record<PortfolioLayer, string> = {
  ...Object.fromEntries(STRATEGY_METRICS.allocations.map(a => [a.name, a.target])),
  Research: 'N/A',
  Closed: 'N/A',
} as Record<PortfolioLayer, string>;

export const getTickerLayer = (ticker: string): PortfolioLayer => {
  const meta = (PORTFOLIO_STRATEGY.layers as Record<string, TickerMetadata>)[ticker.toUpperCase()];
  return meta ? meta.layer : 'Research';
};

export const getTickerThesis = (ticker: string): string | undefined => {
  return PORTFOLIO_STRATEGY.layers[ticker.toUpperCase()]?.thesis;
};

export const getTickerTrigger = (ticker: string, currentPrice: number): string | null => {
  const trigger = PORTFOLIO_STRATEGY.triggers[ticker.toUpperCase()];
  if (!trigger) return null;

  const drop = (currentPrice - trigger.referencePrice) / trigger.referencePrice;
  return drop <= -trigger.dipTrigger ? trigger.message : null;
};

// Spread-aware helper functions
export function isSpread(opt: PortfolioOption): boolean {
  return opt.shortStrike !== undefined && opt.longStrike !== undefined;
}

export function netCredit(opt: PortfolioOption): number {
  return opt.premiumReceived - (opt.premiumPaid ?? 0);
}

export function maxLoss(opt: PortfolioOption): number | null {
  if (!isSpread(opt)) return null;
  const width = Math.abs(opt.shortStrike! - opt.longStrike!);
  return (width - netCredit(opt)) * 100 * opt.contracts;
}

export function maxProfit(opt: PortfolioOption): number {
  return netCredit(opt) * 100 * opt.contracts;
}

export function breakeven(opt: PortfolioOption): number | null {
  const s = opt.strike ?? opt.shortStrike;
  if (s === undefined) return null;
  const nc = netCredit(opt);
  return opt.type === 'call' ? s + nc : s - nc;
}