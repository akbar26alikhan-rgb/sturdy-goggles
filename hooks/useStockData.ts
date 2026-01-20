import { useState, useEffect, useCallback } from 'react';
import { StockQuote, TimeSeriesData } from '@/lib/types';
import { stockAPI } from '@/lib/stockApi';
import { useCache, deduplicateRequest } from '@/lib/cache';

interface UseStockDataOptions {
  refreshInterval?: number; // in seconds
  enableTimeSeries?: boolean;
  timeSeriesInterval?: '1D' | '1W' | '1M';
  enableCaching?: boolean;
}

export const useStockData = (symbol: string, options: UseStockDataOptions = {}) => {
  const {
    refreshInterval = 30,
    enableTimeSeries = false,
    timeSeriesInterval = '1D',
    enableCaching = true
  } = options;
  
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const cache = useCache();
  const cacheKey = `stock_${symbol.toUpperCase()}`;
  const timeSeriesCacheKey = `timeseries_${symbol.toUpperCase()}_${timeSeriesInterval}`;
  
  const fetchQuote = useCallback(async (forceRefresh = false) => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first unless forcing refresh
      if (!forceRefresh && enableCaching) {
        const cachedQuote = cache.get<StockQuote>(cacheKey);
        if (cachedQuote) {
          setQuote(cachedQuote);
          setLastUpdated(new Date());
          setLoading(false);
          return cachedQuote;
        }
      }
      
      // Deduplicate requests
      const data = await deduplicateRequest(
        `quote_${symbol.toUpperCase()}`,
        () => stockAPI.getQuote(symbol)
      );
      
      setQuote(data);
      setLastUpdated(new Date());
      
      // Cache the result
      if (enableCaching) {
        cache.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data';
      setError(errorMessage);
      
      // Try to get cached data as fallback
      const cachedQuote = cache.get<StockQuote>(cacheKey);
      if (cachedQuote) {
        setQuote(cachedQuote);
        setError(`${errorMessage} (using cached data)`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [symbol, cache, cacheKey, enableCaching]);
  
  const fetchTimeSeries = useCallback(async (forceRefresh = false) => {
    if (!symbol || !enableTimeSeries) return;
    
    try {
      // Check cache first unless forcing refresh
      if (!forceRefresh && enableCaching) {
        const cachedData = cache.get<TimeSeriesData>(timeSeriesCacheKey);
        if (cachedData) {
          setTimeSeriesData(cachedData);
          return cachedData;
        }
      }
      
      // Deduplicate requests
      const data = await deduplicateRequest(
        `timeseries_${symbol.toUpperCase()}_${timeSeriesInterval}`,
        () => stockAPI.getTimeSeries(symbol, timeSeriesInterval)
      );
      
      setTimeSeriesData(data);
      
      // Cache the result (longer cache for historical data)
      if (enableCaching) {
        cache.set(timeSeriesCacheKey, data, 30 * 60 * 1000); // 30 minutes
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch time series data';
      setError(errorMessage);
      
      // Try to get cached data as fallback
      const cachedData = cache.get<TimeSeriesData>(timeSeriesCacheKey);
      if (cachedData) {
        setTimeSeriesData(cachedData);
        setError(`${errorMessage} (using cached data)`);
      }
      
      throw err;
    }
  }, [symbol, timeSeriesInterval, enableTimeSeries, cache, timeSeriesCacheKey, enableCaching]);
  
  const refresh = useCallback(async () => {
    try {
      await fetchQuote(true);
      if (enableTimeSeries) {
        await fetchTimeSeries(true);
      }
    } catch {
      // Error already handled in individual fetch functions
    }
  }, [fetchQuote, fetchTimeSeries, enableTimeSeries]);
  
  const clearCache = useCallback(() => {
    cache.remove(cacheKey);
    if (enableTimeSeries) {
      cache.remove(timeSeriesCacheKey);
    }
  }, [cache, cacheKey, timeSeriesCacheKey, enableTimeSeries]);
  
  // Fetch data on mount and when symbol changes
  useEffect(() => {
    if (symbol) {
      fetchQuote();
      if (enableTimeSeries) {
        fetchTimeSeries();
      }
    }
  }, [symbol, fetchQuote, fetchTimeSeries, enableTimeSeries]);
  
  // Set up auto-refresh
  useEffect(() => {
    if (!symbol || !refreshInterval) return;
    
    const interval = setInterval(() => {
      fetchQuote();
      if (enableTimeSeries) {
        fetchTimeSeries();
      }
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [symbol, refreshInterval, fetchQuote, fetchTimeSeries, enableTimeSeries]);
  
  return {
    quote,
    timeSeriesData,
    loading,
    error,
    lastUpdated,
    refresh,
    clearCache,
    fetchQuote: () => fetchQuote(true),
    fetchTimeSeries: () => fetchTimeSeries(true)
  };
};

// Hook for multiple stocks
export const useMultipleStocks = (symbols: string[], options: UseStockDataOptions = {}) => {
  const [stocks, setStocks] = useState<Map<string, StockQuote>>(new Map());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const cache = useCache();
  
  const fetchAllStocks = useCallback(async (forceRefresh = false) => {
    if (symbols.length === 0) return;
    
    setLoading(true);
    const newStocks = new Map(stocks);
    const newErrors = new Map(errors);
    
    try {
      // Fetch all stocks concurrently
      const promises = symbols.map(async (symbol) => {
        try {
          if (!forceRefresh) {
            const cachedQuote = cache.get<StockQuote>(`stock_${symbol.toUpperCase()}`);
            if (cachedQuote) {
              return { symbol, data: cachedQuote, error: null };
            }
          }
          
          const data = await stockAPI.getQuote(symbol);
          cache.set(`stock_${symbol.toUpperCase()}`, data, 5 * 60 * 1000);
          return { symbol, data, error: null };
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
          return { symbol, data: null as StockQuote | null, error: errorMessage };
        }
      });
      
      const results = await Promise.all(promises);
      
      // Update state with results
      results.forEach(({ symbol, data, error }) => {
        if (data) {
          newStocks.set(symbol, data);
          newErrors.delete(symbol);
        } else if (error) {
          newErrors.set(symbol, error);
        }
      });
      
      setStocks(new Map(newStocks));
      setErrors(newErrors);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error fetching multiple stocks:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols, stocks, errors, cache]);
  
  const getStock = useCallback((symbol: string) => {
    return stocks.get(symbol) || null;
  }, [stocks]);
  
  const getError = useCallback((symbol: string) => {
    return errors.get(symbol) || null;
  }, [errors]);
  
  const refresh = useCallback(async () => {
    await fetchAllStocks(true);
  }, [fetchAllStocks]);
  
  const clearAllCache = useCallback(() => {
    symbols.forEach(symbol => {
      cache.remove(`stock_${symbol.toUpperCase()}`);
    });
  }, [symbols, cache]);
  
  // Fetch data on mount and when symbols change
  useEffect(() => {
    if (symbols.length > 0) {
      fetchAllStocks();
    }
  }, [fetchAllStocks]);
  
  // Set up auto-refresh
  useEffect(() => {
    if (symbols.length === 0 || !options.refreshInterval) return;
    
    const interval = setInterval(() => {
      fetchAllStocks();
    }, options.refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [symbols.length, options.refreshInterval, fetchAllStocks]);
  
  return {
    stocks,
    loading,
    errors,
    lastUpdated,
    getStock,
    getError,
    refresh,
    clearAllCache
  };
};

// Hook for search functionality
export const useStockSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cache = useCache();
  
  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const cacheKey = `search_${query.toLowerCase()}`;
      const cachedResults = cache.get(cacheKey);
      
      if (cachedResults) {
        setResults(cachedResults);
        setLoading(false);
        return;
      }
      
      const searchResults = await stockAPI.searchSymbols(query);
      
      // Cache results for 10 minutes
      cache.set(cacheKey, searchResults, 10 * 60 * 1000);
      
      setResults(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);
  
  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);
  
  return {
    results,
    loading,
    error,
    search,
    clearSearch
  };
};