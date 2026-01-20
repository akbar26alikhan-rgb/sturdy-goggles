import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Currency formatting
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatting with abbreviations
export const formatNumber = (
  num: number,
  options: {
    decimals?: number;
    abbreviation?: boolean;
    locale?: string;
  } = {}
): string => {
  const { decimals = 2, abbreviation = false, locale = 'en-US' } = options;
  
  if (abbreviation) {
    if (Math.abs(num) >= 1e12) {
      return (num / 1e12).toFixed(decimals) + 'T';
    } else if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toFixed(decimals) + 'B';
    } else if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(decimals) + 'M';
    } else if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(decimals) + 'K';
    }
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Price change formatting with color
export interface PriceChangeFormat {
  value: string;
  isPositive: boolean;
  isNeutral: boolean;
}

export const formatPriceChange = (change: number, changePercent: number): PriceChangeFormat => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  const value = `${isPositive ? '+' : ''}${formatNumber(change)} (${isPositive ? '+' : ''}${formatPercentage(changePercent)})`;
  
  return {
    value,
    isPositive,
    isNeutral
  };
};

// Volume formatting
export const formatVolume = (volume: number): string => {
  if (volume === 0) return '0';
  
  if (volume >= 1e9) {
    return (volume / 1e9).toFixed(1) + 'B';
  } else if (volume >= 1e6) {
    return (volume / 1e6).toFixed(1) + 'M';
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(1) + 'K';
  }
  
  return volume.toLocaleString();
};

// Date and time formatting
export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm:ss');
};

export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatTimeOnly = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm:ss');
};

// Market status helpers
export const isMarketOpen = (): boolean => {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const hours = easternTime.getHours();
  const minutes = easternTime.getMinutes();
  const day = easternTime.getDay();
  
  // Market is closed on weekends
  if (day === 0 || day === 6) return false;
  
  // Market hours: 9:30 AM - 4:00 PM ET
  const currentMinutes = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  
  return currentMinutes >= marketOpen && currentMinutes <= marketClose;
};

export const getMarketStatus = (): { isOpen: boolean; nextOpen?: Date; nextClose?: Date } => {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = easternTime.getDay();
  const hours = easternTime.getHours();
  const minutes = easternTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  
  // Weekend
  if (day === 0) { // Sunday
    return {
      isOpen: false,
      nextOpen: new Date(easternTime.getTime() + 24 * 60 * 60 * 1000) // Next Monday
    };
  }
  
  if (day === 6) { // Saturday
    return {
      isOpen: false,
      nextOpen: new Date(easternTime.getTime() + 2 * 24 * 60 * 60 * 1000) // Next Monday
    };
  }
  
  const marketOpen = 9 * 60 + 30;
  const marketClose = 16 * 60;
  
  if (currentMinutes >= marketOpen && currentMinutes <= marketClose) {
    return {
      isOpen: true,
      nextClose: new Date(easternTime.getTime() + (marketClose - currentMinutes) * 60 * 1000)
    };
  } else if (currentMinutes < marketOpen) {
    return {
      isOpen: false,
      nextOpen: new Date(easternTime.getTime() + (marketOpen - currentMinutes) * 60 * 1000)
    };
  } else {
    // Market closed, next open is tomorrow
    const nextDay = new Date(easternTime);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return {
      isOpen: false,
      nextOpen: new Date(nextDay.getTime() + marketOpen * 60 * 1000)
    };
  }
};

// CSV export formatting
export const formatForCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
};

// Validation helpers
export const isValidStockSymbol = (symbol: string): boolean => {
  // Basic validation: alphanumeric, max 5 characters for US stocks
  // Allows for .NS, .BO suffixes for Indian stocks
  const cleanSymbol = symbol.replace(/\.(NS|BO)$/, '');
  return /^[A-Z0-9]{1,5}$/i.test(cleanSymbol) && cleanSymbol.length > 0;
};

export const normalizeSymbol = (symbol: string): string => {
  return symbol.toUpperCase().trim();
};

// Color helpers for UI
export const getChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-600 dark:text-green-400';
  if (change < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
};

export const getChangeBgColor = (change: number): string => {
  if (change > 0) return 'bg-green-50 dark:bg-green-900/20';
  if (change < 0) return 'bg-red-50 dark:bg-red-900/20';
  return 'bg-gray-50 dark:bg-gray-800';
};

// Trending analysis
export const calculateMovingAverage = (prices: number[], period: number): number[] => {
  if (prices.length < period) return [];
  
  const averages: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((acc, price) => acc + price, 0);
    averages.push(sum / period);
  }
  return averages;
};

export const calculatePriceChange = (current: number, previous: number): { change: number; changePercent: number } => {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  return { change, changePercent };
};

// Error message formatting
export const formatAPIError = (error: unknown): string => {
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object' && 'response' in error && error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};