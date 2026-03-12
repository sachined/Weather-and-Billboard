import portfolioData from './portfolio-data.json';

export type PortfolioLayer = 'Anchor' | 'Growth' | 'Income' | 'Research';

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
  thesis?: string;
}

export interface StockTrigger {
  referencePrice: number;
  dipTrigger: number;
  message: string;
}

export interface UserPosition {
  symbol: string;
  shares: number;
  addedAt?: string; // ISO date string (YYYY-MM-DD)
}

export const CORE_POSITIONS = portfolioData.corePositions as UserPosition[];
export const PORTFOLIO_STRATEGY = portfolioData.strategy;
export const LAYER_TARGETS = portfolioData.layerTargets as Record<PortfolioLayer, string>;
export const STRATEGY_METRICS = portfolioData.metrics as StrategyMetrics;

// Utility functions remain the same but now pull from the JSON source
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