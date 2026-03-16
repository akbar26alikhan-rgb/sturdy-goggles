import type { LiveQuote, OHLCV, Fundamental, Score, ScoreBreakdown, TradeGrade } from '@/types/stock';

interface ScoringParams {
  quote: LiveQuote;
  prices: OHLCV[];
  fundamentals: Fundamental[];
  sectorPerformance: number;
  institutionalChange: number;
}

export function calculateStockScore(params: ScoringParams): Score {
  const { quote, prices } = params;
  
  const trendScore = calculateTrendScore(prices, quote.ltp);
  const volumeScore = calculateVolumeScore(quote);
  const breakoutScore = calculateBreakoutScore(prices);
  const growthScore = calculateGrowthScore(params.fundamentals);
  const financialScore = calculateFinancialScore(params.fundamentals);
  const valuationScore = calculateValuationScore(quote, params.fundamentals);
  const institutionalScore = calculateInstitutionalScore(params.institutionalChange);
  const sectorScore = calculateSectorScore(params.sectorPerformance);
  
  const totalScore = trendScore + volumeScore + breakoutScore + growthScore + financialScore + valuationScore + institutionalScore + sectorScore;
  const tradeGrade = getTradeGrade(totalScore);
  
  return {
    id: 0, stockId: 0, scoreDate: new Date().toISOString(),
    trendScore, volumeScore, breakoutScore, growthScore, financialScore, valuationScore, institutionalScore, sectorScore,
    totalScore, tradeGrade,
    dma50: calculateSMA(prices, 50), dma200: calculateSMA(prices, 200),
    currentPrice: quote.ltp, dayChange: quote.change, volume: quote.volume, avgVolume20: quote.avgVolume,
    resistance: calculateResistance(prices), support: calculateSupport(prices),
    calculatedAt: new Date().toISOString(),
  };
}

function calculateTrendScore(prices: OHLCV[], currentPrice: number): number {
  if (prices.length < 50) return 5;
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, 200);
  if (!sma50 || !sma200) return 5;
  
  if (currentPrice > sma200 && sma50 > sma200) return 20;
  if (currentPrice > sma200) return 15;
  if (Math.abs(currentPrice - sma200) / sma200 < 0.02) return 10;
  if (currentPrice < sma200 && sma50 > sma200) return 5;
  return 0;
}

function calculateVolumeScore(quote: LiveQuote): number {
  const { volume, avgVolume } = quote;
  if (!volume || !avgVolume) return 7;
  const ratio = volume / avgVolume;
  if (ratio >= 2) return 15;
  if (ratio >= 1.5) return 12;
  if (ratio >= 1) return 10;
  if (ratio >= 0.5) return 5;
  return 2;
}

function calculateBreakoutScore(prices: OHLCV[]): number {
  if (prices.length < 50) return 5;
  const currentPrice = prices[prices.length - 1].close;
  const resistance = calculateResistance(prices);
  const breakout = (currentPrice - resistance) / resistance;
  
  if (breakout > 0.02) return 15;
  if (breakout < -0.02) return 0;
  if (Math.abs(breakout) < 0.01) return 5;
  return 8;
}

function calculateGrowthScore(fundamentals: Fundamental[]): number {
  if (!fundamentals?.length) return 10;
  const growths = fundamentals.slice(0, 4).map(f => (f.salesGrowthYoy || 0) + (f.profitGrowthYoy || 0) + (f.epsGrowthYoy || 0));
  const avgGrowth = growths.reduce((a, b) => a + b, 0) / growths.length / 3;
  
  if (avgGrowth >= 20) return 20;
  if (avgGrowth >= 15) return 15;
  if (avgGrowth >= 10) return 10;
  if (avgGrowth >= 5) return 5;
  return 0;
}

function calculateFinancialScore(fundamentals: Fundamental[]): number {
  if (!fundamentals?.length) return 5;
  const latest = fundamentals[0];
  const debtToEquity = latest?.debtToEquity || 0;
  const cashflow = latest?.operatingCashflow || 0;
  
  let score = 0;
  if (debtToEquity <= 0.5) score += 4;
  else if (debtToEquity <= 1) score += 3;
  else if (debtToEquity <= 2) score += 2;
  
  if (cashflow > 0) score += 4;
  else if (cashflow > -1000) score += 2;
  
  return Math.min(10, score);
}

function calculateValuationScore(quote: LiveQuote, _fundamentals: Fundamental[]): number {
  const pe = quote.peRatio || 20;
  const sectorPE = 20;
  const ratio = pe / sectorPE;
  
  if (ratio <= 0.8) return 10;
  if (ratio <= 1) return 8;
  if (ratio <= 1.3) return 7;
  if (ratio <= 1.7) return 4;
  return 1;
}

function calculateInstitutionalScore(change: number): number {
  if (change >= 3) return 5;
  if (change >= 1) return 4;
  if (change >= -1) return 3;
  if (change >= -3) return 1;
  return 0;
}

function calculateSectorScore(performance: number): number {
  if (performance >= 3) return 5;
  if (performance >= 1) return 4;
  if (performance >= -1) return 3;
  if (performance >= -3) return 1;
  return 0;
}

export function getTradeGrade(score: number): TradeGrade {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function getScoreBreakdown(score: Score): ScoreBreakdown {
  return {
    trend: { score: score.trendScore, maxScore: 20, label: 'Trend Strength', description: getTrendDesc(score.trendScore) },
    volume: { score: score.volumeScore, maxScore: 15, label: 'Volume & Liquidity', description: getVolumeDesc(score.volumeScore) },
    breakout: { score: score.breakoutScore, maxScore: 15, label: 'Breakout / Price Action', description: getBreakoutDesc(score.breakoutScore) },
    growth: { score: score.growthScore, maxScore: 20, label: 'Fundamental Growth', description: getGrowthDesc(score.growthScore) },
    financial: { score: score.financialScore, maxScore: 10, label: 'Financial Strength', description: getFinancialDesc(score.financialScore) },
    valuation: { score: score.valuationScore, maxScore: 10, label: 'Valuation', description: getValuationDesc(score.valuationScore) },
    institutional: { score: score.institutionalScore, maxScore: 5, label: 'Institutional Buying', description: getInstitutionalDesc(score.institutionalScore) },
    sector: { score: score.sectorScore, maxScore: 5, label: 'Sector Strength', description: getSectorDesc(score.sectorScore) },
  };
}

function calculateSMA(prices: OHLCV[], period: number): number | null {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b.close, 0) / period;
}

function calculateResistance(prices: OHLCV[]): number {
  if (prices.length < 20) return prices[prices.length - 1]?.close || 0;
  return Math.max(...prices.slice(-20).map(p => p.high));
}

function calculateSupport(prices: OHLCV[]): number {
  if (prices.length < 20) return prices[prices.length - 1]?.close || 0;
  return Math.min(...prices.slice(-20).map(p => p.low));
}

function getTrendDesc(s: number): string {
  if (s >= 20) return 'Strong uptrend';
  if (s >= 15) return 'Bullish';
  if (s >= 10) return 'Consolidating';
  if (s >= 5) return 'Recovery mode';
  return 'Bearish';
}

function getVolumeDesc(s: number): string {
  if (s >= 12) return 'High volume';
  if (s >= 10) return 'Good volume';
  if (s >= 5) return 'Below average';
  return 'Very low';
}

function getBreakoutDesc(s: number): string {
  if (s >= 15) return 'Confirmed breakout';
  if (s >= 10) return 'Breakout in progress';
  if (s >= 5) return 'Range-bound';
  return 'Breakdown';
}

function getGrowthDesc(s: number): string {
  if (s >= 18) return 'Strong growth';
  if (s >= 14) return 'Good momentum';
  if (s >= 10) return 'Moderate';
  if (s >= 5) return 'Weak';
  return 'Declining';
}

function getFinancialDesc(s: number): string {
  if (s >= 8) return 'Strong';
  if (s >= 6) return 'Manageable';
  if (s >= 4) return 'High debt';
  return 'Risky';
}

function getValuationDesc(s: number): string {
  if (s >= 8) return 'Undervalued';
  if (s >= 6) return 'Slightly expensive';
  if (s >= 4) return 'Overvalued';
  return 'Extremely overvalued';
}

function getInstitutionalDesc(s: number): string {
  if (s >= 4) return 'Strong buying';
  if (s >= 2) return 'Neutral';
  return 'Selling';
}

function getSectorDesc(s: number): string {
  if (s >= 4) return 'Outperforming';
  if (s >= 2) return 'In-line';
  return 'Underperforming';
}
