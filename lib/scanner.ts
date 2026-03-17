import yahooFinance from 'yahoo-finance2';

// Disable yahooFinance caching to get fresh data
yahooFinance.setGlobalConfig({
  queue: {
    concurrency: 1,
  }
});

export interface ScoreBreakdown {
  trend: number;
  volume: number;
  breakout: number;
  growth: number;
  financial: number;
  valuation: number;
  institutional: number;
  sector: number;
  total: number;
  grade: string;
}

export interface StockData {
  quote: any;
  history: any[];
}

export async function getStockData(symbol: string): Promise<StockData | null> {
  const yahooSymbol = symbol.endsWith('.NS') || symbol.endsWith('.BO') ? symbol : `${symbol}.NS`;
  
  try {
    const quote = await yahooFinance.quote(yahooSymbol);
    
    // Fetch historical data for DMA and breakouts (last 300 days)
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 300);
    
    const history = await yahooFinance.historical(yahooSymbol, {
      period1: start,
      period2: end,
      interval: '1d'
    });
    
    return { quote, history };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

export function calculateScores(quote: any, history: any[]): ScoreBreakdown {
  const currentPrice = quote.regularMarketPrice || history[history.length - 1].close;
  const prices = history.map(h => h.close).filter(Boolean);
  
  // A) Trend Strength Score (0-20)
  const dma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length);
  const dma200 = prices.slice(-200).reduce((a, b) => a + b, 0) / Math.min(200, prices.length);
  
  let trend = 0;
  if (currentPrice > dma200 && dma50 > dma200) trend = 20;
  else if (currentPrice > dma200) trend = 15;
  else if (Math.abs(currentPrice - dma200) / dma200 < 0.05) trend = 10;
  else if (currentPrice < dma200 && dma50 > dma200) trend = 5;
  else trend = 0;

  // B) Volume & Liquidity Score (0-15)
  const avgVol20 = quote.averageDailyVolume3Month || quote.averageDailyVolume10Day || 1;
  const currentVol = quote.regularMarketVolume || 0;
  const volRatio = currentVol / avgVol20;
  
  let volume = 0;
  if (volRatio > 2) volume = 15;
  else if (volRatio > 1.2) volume = 10;
  else if (volRatio > 0.8) volume = 5;
  else volume = 0;

  // C) Breakout / Price Action Score (0-15)
  const high52 = quote.fiftyTwoWeekHigh || Math.max(...prices);
  const breakoutRatio = currentPrice / high52;
  let breakout = 0;
  if (breakoutRatio > 0.98) breakout = 15;
  else if (breakoutRatio > 0.90) breakout = 10;
  else if (breakoutRatio > 0.80) breakout = 5;
  else breakout = 0;

  // D) Fundamental Growth Score (0-20)
  // Yahoo Finance provides some growth metrics
  const epsGrowth = quote.earningsQuarterlyGrowth || 0;
  const revenueGrowth = quote.revenueQuarterlyGrowth || 0;
  let growth = 10;
  if (epsGrowth > 0.2 && revenueGrowth > 0.1) growth = 20;
  else if (epsGrowth > 0 || revenueGrowth > 0) growth = 15;
  else if (epsGrowth < 0 && revenueGrowth < 0) growth = 0;
  else growth = 5;

  // E) Financial Strength Score (0-10)
  const debtToEquity = quote.debtToEquity || 0; // note: often in percent or ratio depending on source
  let financial = 5;
  if (debtToEquity < 50) financial = 10;
  else if (debtToEquity < 100) financial = 7;
  else if (debtToEquity < 200) financial = 4;
  else financial = 0;

  // F) Valuation Score (0-10)
  const pe = quote.trailingPE || 0;
  let valuation = 5;
  if (pe > 0 && pe < 20) valuation = 10;
  else if (pe >= 20 && pe < 40) valuation = 7;
  else if (pe >= 40 && pe < 60) valuation = 4;
  else if (pe >= 60) valuation = 0;
  else valuation = 5; // average if PE N/A

  // G) Institutional Buying Score (0-5)
  // Hard to get live from Yahoo Finance, using placeholder
  const institutional = 3;

  // H) Sector Strength Score (0-5)
  const sector = 3;

  const total = trend + volume + breakout + growth + financial + valuation + institutional + sector;
  
  let grade = 'F';
  if (total >= 90) grade = 'A+';
  else if (total >= 80) grade = 'A';
  else if (total >= 70) grade = 'B';
  else if (total >= 60) grade = 'C';
  else if (total >= 40) grade = 'D';

  return { trend, volume, breakout, growth, financial, valuation, institutional, sector, total, grade };
}
