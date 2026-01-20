import { useState, useEffect, useCallback } from 'react';

// Generic cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

class ClientCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;
  
  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
  }
  
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    
    this.cache.set(key, entry);
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
  
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;
    
    for (const entry of this.cache.values()) {
      if (now > entry.expiry) {
        expired++;
      } else {
        valid++;
      }
    }
    
    return {
      total: this.cache.size,
      valid,
      expired,
      keys: Array.from(this.cache.keys())
    };
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
const clientCache = new ClientCache();

// Cleanup expired entries periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    clientCache.cleanup();
  }, 5 * 60 * 1000); // Every 5 minutes
}

// React hooks for cache
export const useCache = () => {
  const get = useCallback(<T>(key: string): T | null => {
    return clientCache.get<T>(key);
  }, []);
  
  const set = useCallback(<T>(key: string, data: T, ttl?: number): void => {
    clientCache.set(key, data, ttl);
  }, []);
  
  const has = useCallback((key: string): boolean => {
    return clientCache.has(key);
  }, []);
  
  const remove = useCallback((key: string): boolean => {
    return clientCache.delete(key);
  }, []);
  
  const clear = useCallback((): void => {
    clientCache.clear();
  }, []);
  
  const getStats = useCallback(() => {
    return clientCache.getStats();
  }, []);
  
  return {
    get,
    set,
    has,
    remove,
    clear,
    getStats
  };
};

// React hook for persisted data with cache
export const usePersistedCache = <T>(key: string, defaultValue: T, options: CacheOptions = {}) => {
  const [data, setData] = useState<T>(() => {
    // Try to get from cache first
    const cached = clientCache.get<T>(key);
    if (cached) return cached;
    
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Cache it for next time
          clientCache.set(key, parsed, options.ttl || 24 * 60 * 60 * 1000); // 24 hours default
          return parsed;
        }
      } catch (error) {
        console.warn(`Failed to load persisted data for key ${key}:`, error);
      }
    }
    
    return defaultValue;
  });
  
  const updateData = useCallback((newData: T | ((prev: T) => T)) => {
    setData(prevData => {
      const updated = typeof newData === 'function' ? (newData as (prev: T) => T)(prevData) : newData;
      
      // Update cache
      clientCache.set(key, updated, options.ttl || 24 * 60 * 60 * 1000);
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`cache_${key}`, JSON.stringify(updated));
        } catch (error) {
          console.warn(`Failed to persist data for key ${key}:`, error);
        }
      }
      
      return updated;
    });
  }, [key, options.ttl]);
  
  const clearData = useCallback(() => {
    setData(defaultValue);
    clientCache.delete(key);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn(`Failed to clear persisted data for key ${key}:`, error);
      }
    }
  }, [key, defaultValue]);
  
  return {
    data,
    updateData,
    clearData,
    isCached: clientCache.has(key)
  };
};

// Offline data management
export const useOfflineData = <T>(key: string, fetchFn: () => Promise<T>, ttl: number = 5 * 60 * 1000) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  
  const cache = useCache();
  const cacheKey = `offline_${key}`;
  
  const loadData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = cache.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsOffline(false);
        return cached;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedData = await fetchFn();
      setData(fetchedData);
      setIsOffline(false);
      
      // Cache the data
      cache.set(cacheKey, fetchedData, ttl);
      
      return fetchedData;
    } catch (err) {
      console.warn(`Failed to fetch data for ${key}, trying cache:`, err);
      
      // Try to get cached data as fallback
      const cached = cache.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsOffline(true);
        setError('Using cached data - connection unavailable');
        return cached;
      }
      
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, cache, cacheKey, ttl]);
  
  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);
  
  const clearCache = useCallback(() => {
    cache.remove(cacheKey);
    setData(null);
  }, [cache, cacheKey]);
  
  // Load data on mount and when key changes
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Optionally refresh data when coming back online
      loadData();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadData]);
  
  return {
    data,
    loading,
    error,
    isOffline,
    refresh,
    clearCache,
    loadData
  };
};

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

export const deduplicateRequest = <T>(key: string, requestFn: () => Promise<T>): Promise<T> => {
  // If request is already pending, return the existing promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  
  // Create new request
  const requestPromise = requestFn()
    .finally(() => {
      // Clean up after request completes
      pendingRequests.delete(key);
    });
  
  pendingRequests.set(key, requestPromise);
  return requestPromise;
};

// Memory usage monitoring (for debugging)
export const getCacheMemoryUsage = (): { size: number; approximateSize: string } => {
  const stats = clientCache.getStats();
  // Rough estimation of memory usage
  const estimatedBytes = JSON.stringify(Array.from(clientCache.cache.entries())).length;
  const estimatedSize = estimatedBytes < 1024 ? `${estimatedBytes} B` :
                      estimatedBytes < 1024 * 1024 ? `${(estimatedBytes / 1024).toFixed(1)} KB` :
                      `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;
  
  return {
    size: stats.total,
    approximateSize: estimatedSize
  };
};

export { clientCache };
export type { CacheEntry, CacheOptions };