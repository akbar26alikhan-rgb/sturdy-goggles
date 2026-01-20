// Stock data types
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  timestamp: string;
  name?: string;
}

export interface StockCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TimeSeriesData {
  symbol: string;
  interval: '1D' | '1W' | '1M';
  candles: StockCandle[];
  lastUpdated: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency?: string;
}

export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  timestamp: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Chart configuration types
export interface ChartConfig {
  type: 'line' | 'candlestick';
  interval: '1D' | '1W' | '1M';
  showVolume: boolean;
  showMovingAverage: boolean;
  period?: number;
}

// Watchlist types
export interface WatchlistItem {
  symbol: string;
  name?: string;
  addedAt: string;
  notes?: string;
}

// Settings types
export interface AppSettings {
  darkMode: boolean;
  autoRefreshInterval: number; // in seconds
  currency: 'USD' | 'EUR' | 'INR' | 'GBP';
  defaultWatchlist: string[];
  chartType: 'line' | 'candlestick';
  showVolume: boolean;
  showMovingAverage: boolean;
}

// Error types
export interface APIError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

// Rate limit info
export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  limit: number;
}

// NSE API response types
export interface NSEResponse {
  price: number;
  netChange: number;
  pChange: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  totalTradedValue: number;
  totalTradedVolume: number;
}

// Alpha Vantage response types
export interface AlphaVantageQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

export interface AlphaVantageTimeSeries {
  [key: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
}

export interface AlphaVantageSearchResponse {
  bestMatches: Array<{
    '1. symbol': string;
    '2. name': string;
    '3. type': string;
    '4. region': string;
    '5. marketOpen': string;
    '6. marketClose': string;
    '7. timezone': string;
    '8. currency': string;
    '9. matchScore': string;
  }>;
}