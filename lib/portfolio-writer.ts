import fs from 'fs';
import path from 'path';
import { computePosition } from './portfolio-logic';

const DATA_PATH = path.join(process.cwd(), 'lib', 'portfolio-data.json');

interface Lot {
  shares: number;
  date: string; // YYYY-MM-DD
  costBasis?: number;
}

interface PositionMetadata {
  layer: string;
  thesis?: string;
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data: unknown) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/** Read current positions from disk — always reflects the latest file state. */
export function getPositions() {
  const data = readData();
  return (data.corePositions as Array<{ symbol: string; lots: Lot[] }>).map(r =>
    computePosition(r.symbol, r.lots)
  );
}

/** Add a lot to an existing position. Throws if symbol not found. */
export function addLot(symbol: string, lot: Lot): void {
  const upper = symbol.toUpperCase();
  const data = readData();

  const position = data.corePositions.find(
    (p: { symbol: string }) => p.symbol === upper
  );
  if (!position) {
    throw new Error(`Symbol ${upper} not found in corePositions. Use addPosition to create a new one.`);
  }

  position.lots.push(lot);
  writeData(data);
}

/**
 * Add a brand-new position. Updates both corePositions and strategy.layers atomically.
 * Throws if symbol already exists.
 */
export function addPosition(symbol: string, metadata: PositionMetadata, initialLot: Lot): void {
  const upper = symbol.toUpperCase();
  const data = readData();

  if (data.corePositions.some((p: { symbol: string }) => p.symbol === upper)) {
    throw new Error(`Symbol ${upper} already exists. Use addLot to add a trade.`);
  }

  data.corePositions.push({ symbol: upper, lots: [initialLot] });
  data.strategy.layers[upper] = { ...metadata, status: 'active' };

  writeData(data);
}

/**
 * Update lots for an existing position, or create a new one defaulting to Research layer.
 * Used by the API when the UI sends a full updated position.
 */
export function upsertLots(symbol: string, lots: Lot[]): void {
  const upper = symbol.toUpperCase();
  const data = readData();

  const existing = data.corePositions.find(
    (p: { symbol: string }) => p.symbol === upper
  );

  if (existing) {
    existing.lots = lots;
  } else {
    data.corePositions.push({ symbol: upper, lots });
    if (!data.strategy.layers[upper]) {
      data.strategy.layers[upper] = { layer: 'Research', status: 'active' };
    }
  }

  writeData(data);
}

/** Mark a position as closed in strategy.layers. Does not touch lot history. */
export function closePosition(symbol: string): void {
  const upper = symbol.toUpperCase();
  const data = readData();

  if (!data.strategy.layers[upper]) {
    throw new Error(`Symbol ${upper} not found in strategy.layers.`);
  }

  data.strategy.layers[upper].status = 'closed';
  data.strategy.layers[upper].layer = 'Closed';
  writeData(data);
}
