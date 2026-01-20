import axios from 'axios';
import { 
  StockQuote, 
  TimeSeriesData, 
  SearchResult, 
  RateLimitInfo
} from './types';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const NSE_BASE_URL = 'http://nse-api-khaki.vercel.app';

// Cache management
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class StockCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, timestamp: Date.now(), expiry });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

const cache = new StockCache();

// Rate limiting
class RateLimiter {
  private calls: number[] = [];
  private readonly maxCalls = 100; // Alpha Vantage free tier limit
  private readonly timeWindow = 24 * 60 * 60 * 1000; // 24 hours
  
  canMakeCall(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    return this.calls.length < this.maxCalls;
  }
  
  recordCall(): void {
    this.calls.push(Date.now());
  }
  
  getRemainingCalls(): number {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxCalls - this.calls.length);
  }
  
  getResetTime(): number {
    if (this.calls.length === 0) return Date.now();
    const oldestCall = Math.min(...this.calls);
    return oldestCall + this.timeWindow;
  }
}

const rateLimiter = new RateLimiter();

// Utility functions
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const exponentialBackoff = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
  throw new Error('Max retries exceeded');
};

const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formatter.format(amount);
};

// API Client Classes
class AlphaVantageClient {
  private apiKey: string;
  private baseUrl = ALPHA_VANTAGE_BASE_URL;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  private async makeRequest(params: Record<string, string>): Promise<unknown> {
    if (!rateLimiter.canMakeCall()) {
      throw new Error(`Rate limit exceeded. ${rateLimiter.getRemainingCalls()} calls remaining.`);
    }
    
    const cacheKey = `alpha_vantage_${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for ${params.function} - ${params.symbol}`);
      return cached;
    }
    
    rateLimiter.recordCall();
    
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          ...params,
          apikey: this.apiKey
        },
        timeout: 10000
      });
      
      // Check for API error responses
      if (response.data && typeof response.data === 'object' && 'Error Message' in response.data) {
        const errorMessage = (response.data as { [key: string]: unknown })['Error Message'];
        throw new Error(`Alpha Vantage API Error: ${String(errorMessage)}`);
      }
      
      if (response.data && typeof response.data === 'object' && 'Note' in response.data) {
        const noteMessage = (response.data as { [key: string]: unknown })['Note'];
        throw new Error(`API call frequency exceeded: ${String(noteMessage)}`);
      }
      
      // Cache successful responses
      const ttl = params.function === 'GLOBAL_QUOTE' ? 5 * 60 * 1000 : 30 * 60 * 1000;
      cache.set(cacheKey, response.data, ttl);
      
      return response.data;
    } catch (error) {
      console.error(`Alpha Vantage API request failed:`, error);
      throw error;
    }
  }
  
  async getQuote(symbol: string): Promise<StockQuote> {
    const data = await this.makeRequest({
      function: 'GLOBAL_QUOTE',
      symbol: symbol.toUpperCase()
    });
    
    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No data found for symbol: ${symbol}`);
    }
    
    const parsedQuote: StockQuote = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
      timestamp: quote['07. latest trading day']
    };
    
    return parsedQuote;
  }
  
  async getTimeSeries(symbol: string, interval: '1D' | '1W' | '1M'): Promise<TimeSeriesData> {
    let function_name: string;
    let interval_param = '';
    
    switch (interval) {
      case '1D':
        function_name = 'TIME_SERIES_INTRADAY';
        interval_param = '5min';
        break;
      case '1W':
      case '1M':
        function_name = 'TIME_SERIES_DAILY';
        break;
      default:
        function_name = 'TIME_SERIES_DAILY';
    }
    
    const params: Record<string, string> = {
      function: function_name,
      symbol: symbol.toUpperCase(),
      outputsize: interval === '1M' ? 'full' : 'compact'
    };
    
    if (interval_param) {
      params.interval = interval_param;
    }
    
    const data = await this.makeRequest(params);
    
    const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
    if (!timeSeriesKey) {
      throw new Error(`No time series data found for symbol: ${symbol}`);
    }
    
    const timeSeries = data[timeSeriesKey];
    const candles = Object.entries(timeSeries)
      .map(([timestamp, values]) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Filter candles based on interval
    let filteredCandles = candles;
    if (interval === '1W') {
      // Take last 7 days
      filteredCandles = candles.slice(-7);
    } else if (interval === '1M') {
      // Take last 30 days
      filteredCandles = candles.slice(-30);
    }
    
    return {
      symbol: symbol.toUpperCase(),
      interval,
      candles: filteredCandles,
      lastUpdated: new Date().toISOString()
    };
  }
  
  async searchSymbols(query: string): Promise<SearchResult[]> {
    const data = await this.makeRequest({
      function: 'SYMBOL_SEARCH',
      keywords: query
    });
    
    const matches = data['bestMatches'] || [];
    return matches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency']
    }));
  }
}

class NSEClient {
  private baseUrl = NSE_BASE_URL;
  
  async getQuote(symbol: string): Promise<StockQuote> {
    const cacheKey = `nse_${symbol.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`NSE cache hit for ${symbol}`);
      return cached;
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/symbol/${symbol.toLowerCase()}`, {
        timeout: 10000
      });
      
      const data = response.data;
      
      const parsedQuote: StockQuote = {
        symbol: symbol.toUpperCase(),
        price: data.price,
        change: data.netChange,
        changePercent: data.pChange,
        volume: data.volume,
        high: data.dayHigh,
        low: data.dayLow,
        open: data.open || data.dayOpen || 0,
        previousClose: data.previousClose || data.yesterdayClose || 0,
        marketCap: data.totalTradedValue,
        timestamp: new Date().toISOString(),
        name: symbol.toUpperCase()
      };
      
      // Cache NSE data for 2 minutes (more frequent updates)
      cache.set(cacheKey, parsedQuote, 2 * 60 * 1000);
      
      return parsedQuote;
    } catch (error) {
      console.error(`NSE API request failed for ${symbol}:`, error);
      throw new Error(`Failed to fetch data from NSE for ${symbol}`);
    }
  }
  
  async searchSymbols(query: string): Promise<SearchResult[]> {
    // NSE API doesn't have search, return common Indian stocks
    const commonIndianStocks = [
      { symbol: 'RELIANCE', name: 'Reliance Industries', region: 'India' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', region: 'India' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', region: 'India' },
      { symbol: 'INFY', name: 'Infosys', region: 'India' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', region: 'India' },
      { symbol: 'ITC', name: 'ITC Limited', region: 'India' },
      { symbol: 'SBIN', name: 'State Bank of India', region: 'India' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', region: 'India' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', region: 'India' },
      { symbol: 'LT', name: 'Larsen & Toubro', region: 'India' }
    ];
    
    return commonIndianStocks
      .filter(stock => stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
                     stock.name.toLowerCase().includes(query.toLowerCase()))
      .map(stock => ({
        ...stock,
        type: 'Equity',
        currency: 'INR'
      }));
  }
}

// Main API Client
class StockAPI {
  private alphaVantage: AlphaVantageClient | null = null;
  private nse: NSEClient = new NSEClient();
  private apiKey: string | null = null;
  
  constructor() {
    this.apiKey = process.env.VITE_ALPHA_VANTAGE_KEY || null;
    if (this.apiKey && this.apiKey !== 'your_alpha_vantage_api_key_here') {
      this.alphaVantage = new AlphaVantageClient(this.apiKey);
    } else {
      console.warn('Alpha Vantage API key not found. NSE API will be used as fallback.');
    }
  }
  
  async getQuote(symbol: string): Promise<StockQuote> {
    const upperSymbol = symbol.toUpperCase();
    
    // Try Alpha Vantage first if available
    if (this.alphaVantage) {
      try {
        const quote = await this.alphaVantage.getQuote(upperSymbol);
        console.log(`Fetched quote for ${upperSymbol} from Alpha Vantage`);
        return quote;
      } catch (error) {
        console.warn(`Alpha Vantage failed for ${upperSymbol}, trying NSE:`, error);
      }
    }
    
    // Fallback to NSE for Indian stocks
    if (upperSymbol.includes('.NS') || upperSymbol.includes('.BO')) {
      try {
        const quote = await this.nse.getQuote(upperSymbol.replace('.NS', '').replace('.BO', ''));
        console.log(`Fetched quote for ${upperSymbol} from NSE`);
        return quote;
      } catch (error) {
        console.error(`Both APIs failed for ${upperSymbol}:`, error);
        throw error;
      }
    }
    
    // For US stocks without Alpha Vantage key
    throw new Error(`Alpha Vantage API key required for US stocks. NSE fallback only supports Indian stocks.`);
  }
  
  async getTimeSeries(symbol: string, interval: '1D' | '1W' | '1M'): Promise<TimeSeriesData> {
    const upperSymbol = symbol.toUpperCase();
    
    if (this.alphaVantage) {
      try {
        const timeSeries = await this.alphaVantage.getTimeSeries(upperSymbol, interval);
        console.log(`Fetched time series for ${upperSymbol} from Alpha Vantage`);
        return timeSeries;
      } catch (error) {
        console.warn(`Alpha Vantage time series failed for ${upperSymbol}:`, error);
        throw new Error(`Time series data not available. Alpha Vantage API key required.`);
      }
    }
    
    throw new Error(`Time series data not available without Alpha Vantage API key.`);
  }
  
  async searchSymbols(query: string): Promise<SearchResult[]> {
    if (this.alphaVantage && query.length > 1) {
      try {
        const results = await this.alphaVantage.searchSymbols(query);
        console.log(`Found ${results.length} symbols for "${query}" from Alpha Vantage`);
        return results;
      } catch (error) {
        console.warn(`Alpha Vantage search failed, using NSE fallback:`, error);
      }
    }
    
    // Fallback to NSE search
    try {
      const results = await this.nse.searchSymbols(query);
      console.log(`Found ${results.length} symbols for "${query}" from NSE`);
      return results;
    } catch (error) {
      console.error(`Symbol search failed:`, error);
      return [];
    }
  }
  
  getRateLimitInfo(): RateLimitInfo {
    return {
      remaining: rateLimiter.getRemainingCalls(),
      resetTime: rateLimiter.getResetTime(),
      limit: 100
    };
  }
  
  getCacheStats() {
    return cache.getStats();
  }
  
  clearCache() {
    cache.clear();
    console.log('Stock API cache cleared');
  }
}

// Export singleton instance
export const stockAPI = new StockAPI();
export { StockAPI, AlphaVantageClient, NSEClient, StockCache };