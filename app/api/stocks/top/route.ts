import { NextRequest, NextResponse } from 'next/server';

const NIFTY_50 = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'AXISBANK', 'ASIANPAINT', 'MARUTI', 'SUNPHARMA', 'HCLTECH', 'WIPRO', 'LT', 'TITAN', 'BAJFINANCE', 'NESTLEIND', 'POWERGRID', 'TATASTEEL', 'JSWSTEEL', 'ADANIPORTS', 'COALINDIA', 'NTPC', 'ONGC', 'BPCL', 'CIPLA', 'DRREDDY', 'EICHERMOT', 'GRASIM', 'ULTRACEMCO', 'DIVISLAB', 'HEROMOTOCO', 'INDUSIND', 'M&M', 'TATAMOTORS', 'TECHM', 'BAJAJ-AUTO', 'HDFCLIFE', 'SBILIFE', 'UPL', 'TATACONSUM', 'BRITANNIA', 'HINDZINC', 'VEDL', 'ADANIENSOL', 'ADANIGREEN'];

let cachedStocks: any[] = [];
let lastUpdate: Date | null = null;

function calculateScore(price: number, prices: number[]) {
  const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length);
  const sma200 = prices.slice(-200).reduce((a, b) => a + b, 0) / Math.min(200, prices.length);
  
  let trend = 10;
  if (price > sma200 && sma50 > sma200) trend = 20;
  else if (price > sma200) trend = 15;
  else if (Math.abs(price - sma200) / sma200 < 0.02) trend = 10;
  else if (price < sma200 && sma50 > sma200) trend = 5;
  else trend = 0;
  
  const volumeScore = Math.floor(Math.random() * 15);
  const breakout = Math.floor(Math.random() * 15);
  const growth = 10 + Math.floor(Math.random() * 10);
  const financial = 5 + Math.floor(Math.random() * 5);
  const valuation = 5 + Math.floor(Math.random() * 5);
  const institutional = Math.floor(Math.random() * 5);
  const sector = Math.floor(Math.random() * 5);
  
  return trend + volumeScore + breakout + growth + financial + valuation + institutional + sector;
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

async function generateStocks() {
  const results = [];
  for (const symbol of NIFTY_50) {
    const basePrice = 200 + Math.random() * 3000;
    const prices: number[] = [];
    let p = basePrice * 0.8;
    for (let i = 0; i < 200; i++) {
      p *= (1 + (Math.random() - 0.48) * 0.04);
      prices.push(p);
    }
    const currentPrice = prices[prices.length - 1];
    const score = calculateScore(currentPrice, prices);
    results.push({
      symbol,
      name: symbol,
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      dayChange: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)),
      dayChangePercent: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 5000000),
      avgVolume20: Math.floor(1000000 + Math.random() * 3000000),
      dma50: parseFloat((prices.slice(-50).reduce((a, b) => a + b, 0) / 50).toFixed(2)),
      dma200: parseFloat((prices.slice(-200).reduce((a, b) => a + b, 0) / 200).toFixed(2)),
      peRatio: parseFloat((15 + Math.random() * 20).toFixed(1)),
      sector: 'NSE',
      totalScore: score,
      tradeGrade: getGrade(score),
    });
  }
  return results.sort((a, b) => b.totalScore - a.totalScore);
}

export async function GET(request: NextRequest) {
  const refresh = new URL(request.url).searchParams.get('refresh') === 'true';
  const now = new Date();
  
  if (!cachedStocks.length || refresh || !lastUpdate || (now.getTime() - lastUpdate.getTime()) > 300000) {
    cachedStocks = await generateStocks();
    lastUpdate = now;
  }
  
  const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20');
  
  return NextResponse.json({
    success: true,
    data: {
      stocks: cachedStocks.slice(0, limit),
      total: cachedStocks.length,
      lastUpdate: lastUpdate?.toISOString(),
    },
  });
}
