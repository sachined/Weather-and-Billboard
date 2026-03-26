import { addLot, addPosition, closePosition, getPositions } from '../lib/portfolio-writer';
import { getTickerLayer } from '../lib/portfolio-logic';

const VALID_LAYERS = ['Anchor', 'Growth', 'Income', 'Asymmetric', 'Research'];

const args = process.argv.slice(2);
const command = args[0];

function usage() {
  console.log(`
Usage: npm run trade -- <command> [args]

Commands:
  list
  add-lot     <symbol> <shares> <date YYYY-MM-DD> [costBasis]
  add-position <symbol> <layer> <shares> <date YYYY-MM-DD> [costBasis]
  close       <symbol>

Layers: ${VALID_LAYERS.join(', ')}

Examples:
  npm run trade -- list
  npm run trade -- add-lot NVDA 5 2026-03-26
  npm run trade -- add-lot NVDA 5 2026-03-26 115.00
  npm run trade -- add-position O Income 10 2026-03-26
  npm run trade -- close TSM
  `);
}

function parseDate(raw: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    console.error(`Error: date must be YYYY-MM-DD, got "${raw}"`);
    process.exit(1);
  }
  return raw;
}

function parseShares(raw: string): number {
  const n = parseFloat(raw);
  if (isNaN(n)) {
    console.error(`Error: shares must be a number, got "${raw}"`);
    process.exit(1);
  }
  return n;
}

function parseCostBasis(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const n = parseFloat(raw);
  if (isNaN(n) || n <= 0) {
    console.error(`Error: costBasis must be a positive number, got "${raw}"`);
    process.exit(1);
  }
  return n;
}

switch (command) {
  case 'list': {
    const positions = getPositions().filter(p => p.shares > 0);
    if (positions.length === 0) {
      console.log('No active positions.');
      break;
    }
    console.log('\nActive positions:\n');
    console.log('  Symbol   Shares   Layer');
    console.log('  ------   ------   -----');
    for (const p of positions) {
      const layer = getTickerLayer(p.symbol);
      if (layer === 'Closed') continue;
      console.log(`  ${p.symbol.padEnd(8)} ${String(p.shares).padEnd(8)} ${layer}`);
    }
    console.log('');
    break;
  }

  case 'add-lot': {
    const [, symbol, sharesRaw, dateRaw, costBasisRaw] = args;
    if (!symbol || !sharesRaw || !dateRaw) {
      console.error('Error: add-lot requires <symbol> <shares> <date>');
      usage();
      process.exit(1);
    }
    const lot = {
      shares: parseShares(sharesRaw),
      date: parseDate(dateRaw),
      ...(parseCostBasis(costBasisRaw) !== undefined && { costBasis: parseCostBasis(costBasisRaw) }),
    };
    try {
      addLot(symbol, lot);
      console.log(`✓ Added ${lot.shares} shares of ${symbol.toUpperCase()} on ${lot.date}`);
    } catch (e: any) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
    break;
  }

  case 'add-position': {
    const [, symbol, layer, sharesRaw, dateRaw, costBasisRaw] = args;
    if (!symbol || !layer || !sharesRaw || !dateRaw) {
      console.error('Error: add-position requires <symbol> <layer> <shares> <date>');
      usage();
      process.exit(1);
    }
    if (!VALID_LAYERS.includes(layer)) {
      console.error(`Error: layer must be one of ${VALID_LAYERS.join(', ')}`);
      process.exit(1);
    }
    const lot = {
      shares: parseShares(sharesRaw),
      date: parseDate(dateRaw),
      ...(parseCostBasis(costBasisRaw) !== undefined && { costBasis: parseCostBasis(costBasisRaw) }),
    };
    try {
      addPosition(symbol, { layer }, lot);
      console.log(`✓ Added new position ${symbol.toUpperCase()} (${layer}) with ${lot.shares} shares on ${lot.date}`);
      console.log(`  Tip: edit strategy.layers.${symbol.toUpperCase()}.thesis in portfolio-data.json to add a thesis.`);
    } catch (e: any) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
    break;
  }

  case 'close': {
    const [, symbol] = args;
    if (!symbol) {
      console.error('Error: close requires <symbol>');
      usage();
      process.exit(1);
    }
    try {
      closePosition(symbol);
      console.log(`✓ ${symbol.toUpperCase()} marked as closed. Lot history preserved.`);
    } catch (e: any) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
    break;
  }

  default:
    if (command) console.error(`Unknown command: "${command}"\n`);
    usage();
    process.exit(command ? 1 : 0);
}
