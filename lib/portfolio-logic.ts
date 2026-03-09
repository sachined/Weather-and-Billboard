// lib/portfolio-logic.ts

export type PortfolioLayer = 'Anchor' | 'Growth' | 'Income' | 'Research';

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

export const CORE_POSITIONS: UserPosition[] = [
  { symbol: 'RKLB', shares: 115 },
  { symbol: 'GOOGL', shares: 10 },
  { symbol: 'AVGO', shares: 6 },
  { symbol: 'MSFT', shares: 2 },
  { symbol: 'NFLX', shares: 5 },
  { symbol: 'KO', shares: 10 },
  { symbol: 'ABBV', shares: 2 },
  { symbol: 'IBM', shares: 2 },
  { symbol: 'MAIN', shares: 10 },
    { symbol: 'VTI', shares: 2 },
  { symbol: 'ARCC', shares: 10 }
];

export const PORTFOLIO_STRATEGY = {
  layers: {
    RKLB: { layer: 'Anchor', thesis: '10-year conviction on space infrastructure & end-to-end launch services.' },
    GOOGL: { layer: 'Growth', thesis: 'AI infrastructure & Search dominance.' },
    AVGO: { layer: 'Growth', thesis: 'Semiconductor consolidation & AI networking.' },
    MSFT: { layer: 'Growth', thesis: 'Cloud & Enterprise AI leader.' },
    NFLX: { layer: 'Growth', thesis: 'Entertainment Leader with high-quality AI.' },
    MAIN: { layer: 'Income', thesis: 'Monthly dividend BDC with strong track record.' },
    ARCC: { layer: 'Income', thesis: 'Leading BDC with high-quality loan portfolio.' },
    KO: { layer: 'Income', thesis: 'Consumer staple stability & consistent dividend growth.' },
    ABBV: { layer: 'Income', thesis: 'Healthcare/Biotech with strong cash flow.' },
    IBM: { layer: 'Income', thesis: 'Quantum computing & Enterprise hybrid cloud.' },
    VTI: { layer: 'Income', thesis: 'High-quality stocks with consistent dividend growth.' }
  } as Record<string, TickerMetadata>,
  triggers: {
    RKLB: {
      referencePrice: 75,
      dipTrigger: 0.40, // 40% drop
      message: "🔥 STRATEGIC ACCUMULATION TRIGGER"
    }
  } as Record<string, StockTrigger>
};

// lib/portfolio-logic.ts (Additions)

export const LAYER_TARGETS: Record<PortfolioLayer, string> = {
  'Anchor': '38%',
  'Growth': '35-40%',
  'Income': '20-25%',
  'Research': 'N/A'
};

export const STRATEGY_METRICS = {
  philosophy: "Growth + Income Consolidation",
  objective: "10-Year capital appreciation with dividend-funded opportunistic buys.",
  allocations: [
    { name: 'Anchor', target: '38%', focus: 'High-Conviction Growth (RKLB)' },
    { name: 'Growth', target: '35-40%', focus: 'Mega-cap Compounders (GOOGL, AVGO)' },
    { name: 'Income', target: '20-25%', focus: 'Yield & Stability (MAIN, ARCC)' }
  ],
  rules: [
    "Trim non-RKLB positions if they exceed 15% weight.",
    "Execute RKLB 'Dip-Buy' at 40% retracement from $75.",
    "Reinvest dividends into highest-conviction or RKLB during triggers."
  ]
};

export const getTickerLayer = (ticker: string): PortfolioLayer => {
  const meta = PORTFOLIO_STRATEGY.layers[ticker.toUpperCase()];
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