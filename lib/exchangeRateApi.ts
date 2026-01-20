import { ExchangeRateResponse, ApiError } from './types';

const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

// Cache for exchange rates to avoid hitting rate limits
const rateCache = new Map<string, { data: ExchangeRateResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Default currencies to ensure we have popular options even if API fails
const DEFAULT_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'NZD', name: 'New Zealand Dollar' },
];

/**
 * Fetch supported currencies from the API
 */
export async function fetchSupportedCurrencies(): Promise<{ code: string; name: string }[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/USD`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.rates) {
      throw new Error('Invalid response format');
    }

    return Object.entries(data.rates).map(([code, name]) => ({
      code,
      name: typeof name === 'string' ? name : `${code}`
    }));
  } catch (error) {
    console.warn('Failed to fetch currencies from API, using default list:', error);
    return DEFAULT_CURRENCIES;
  }
}

/**
 * Fetch exchange rate between two currencies
 */
export async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<ExchangeRateResponse> {
  const cacheKey = `${fromCurrency}-${toCurrency}`;
  const cached = rateCache.get(cacheKey);
  
  // Return cached data if it's still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${fromCurrency}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.rates || !data.rates[toCurrency]) {
      throw new Error('Currency not found in response');
    }

    const rate = data.rates[toCurrency];
    const result: ExchangeRateResponse = {
      base: fromCurrency,
      target: toCurrency,
      rate,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    // Cache the result
    rateCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Return a mock rate if API fails (for development/testing)
    if (process.env.NODE_ENV === 'development') {
      const mockRates: { [key: string]: number } = {
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110,
        'AUD': 1.35,
        'CAD': 1.25,
        'CHF': 0.92,
        'CNY': 7.2,
        'SEK': 8.8,
        'NZD': 1.42,
      };
      
      const mockRate = mockRates[toCurrency] || 1;
      return {
        base: fromCurrency,
        target: toCurrency,
        rate: mockRate,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
    }
    
    throw {
      message: error instanceof Error ? error.message : 'Failed to fetch exchange rate'
    } as ApiError;
  }
}

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(amount: string, rate: number): string {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0';
  
  const converted = numAmount * rate;
  return converted.toFixed(2);
}

/**
 * Format currency amount with proper locale
 */
export function formatCurrency(amount: string, currencyCode: string): string {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0.00';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  } catch {
    // Fallback to simple formatting if currency code is not recognized
    return `${numAmount.toFixed(2)} ${currencyCode}`;
  }
}

/**
 * Get exchange rate display text
 */
export function getExchangeRateText(fromCurrency: string, toCurrency: string, rate: number): string {
  if (!rate || rate <= 0) return '';
  return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}

/**
 * Clear the rate cache (useful for testing or forcing refresh)
 */
export function clearRateCache(): void {
  rateCache.clear();
}

/**
 * Check if we have valid cached data for a currency pair
 */
export function hasCachedRate(fromCurrency: string, toCurrency: string): boolean {
  const cacheKey = `${fromCurrency}-${toCurrency}`;
  const cached = rateCache.get(cacheKey);
  
  if (!cached) return false;
  
  return Date.now() - cached.timestamp < CACHE_DURATION;
}