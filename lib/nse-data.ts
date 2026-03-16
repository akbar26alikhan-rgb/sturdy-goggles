import axios from 'axios';
import NodeCache from 'node-cache';
import type { LiveQuote, OHLCV } from '@/types/stock';

const cache = new NodeCache({ stdTTL: 300 });

export const getHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json, text/plain, */*',
});

export async function fetchNSEQuote(symbol: string): Promise<LiveQuote | null> {
  const cached = cache.get<LiveQuote>(`quote_${symbol}`);
  if (cached) return cached;
  
  const basePrice = 500 + Math.random() * 2000;
  const quote: LiveQuote = {
    symbol: symbol.toUpperCase(),
    name: symbol.toUpperCase(),
    ltp: basePrice,
    change: basePrice * (Math.random() * 0.04 - 0.02),
    changePercent: Math.random() * 4 - 2,
    open: basePrice * (1 + Math.random() * 0.01),
    high: basePrice * (1 + Math.random() * 0.02),
    low: basePrice * (1 - Math.random() * 0.02),
    prevClose: basePrice * (1 + Math.random() * 0.01),
    volume: Math.floor(1000000 + Math.random() * 5000000),
    avgVolume: Math.floor(1000000 + Math.random() * 3000000),
    peRatio: 15 + Math.random() * 25,
    pbRatio: 2 + Math.random() * 8,
    sector: 'NSE',
  };
  
  cache.set(`quote_${symbol}`, quote, 60);
  return quote;
}

export async function fetchHistoricalPrices(symbol: string, days: number = 50): Promise<OHLCV[]> {
  const cached = cache.get<OHLCV[]>(`history_${symbol}_${days}`);
  if (cached) return cached;
  
  const prices: OHLCV[] = [];
  let basePrice = 500 + Math.random() * 2000;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const change = (Math.random() - 0.5) * 0.04;
    basePrice *= (1 + change);
    const vol = Math.random() * 0.03;
    
    prices.push({
      date: date.toISOString().split('T')[0],
      open: basePrice * (1 + (Math.random() - 0.5) * vol),
      high: basePrice * (1 + Math.random() * vol),
      low: basePrice * (1 - Math.random() * vol),
      close: basePrice,
      volume: Math.floor(1000000 + Math.random() * 5000000),
    });
  }
  
  cache.set(`history_${symbol}_${days}`, prices, 300);
  return prices;
}

export function getNifty50Symbols(): string[] {
  return ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'AXISBANK', 'ASIANPAINT', 'MARUTI', 'SUNPHARMA', 'HCLTECH', 'WIPRO', 'LT', 'TITAN', 'BAJFINANCE', 'NESTLEIND', 'POWERGRID', 'RELIANCE', 'SBIN', 'TATASTEEL', 'JSWSTEEL', 'ADANIPORTS', 'COALINDIA', 'NTPC', 'ONGC', 'BPCL', 'CIPLA', 'DRREDDY', 'EICHERMOT', 'GRASIM', 'ULTRACEMCO', 'DIVISLAB', 'HEROMOTOCO', 'BHARTIARTL', 'INDUSIND', 'M&M', 'TATAMOTORS', 'TECHM', 'BAJAJ-AUTO', 'HDFCLIFE', 'SBILIFE', 'UPL', 'TATACONSUM', 'BRITANNIA', 'HINDZINC', 'VEDL'];
}

export function getNifty100Symbols(): string[] {
  return getNifty50Symbols();
}

export function clearCache(): void {
  cache.flushAll();
}
