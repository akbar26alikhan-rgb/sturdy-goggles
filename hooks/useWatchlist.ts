import { useState, useEffect, useCallback } from 'react';
import { WatchlistItem } from '@/lib/types';
import { usePersistedCache } from '@/lib/cache';

const DEFAULT_WATCHLIST = ['AAPL', 'GOOGL', 'MSFT', 'RELIANCE.NS'];

interface UseWatchlistOptions {
  defaultWatchlist?: string[];
  enablePersistence?: boolean;
}

export const useWatchlist = (options: UseWatchlistOptions = {}) => {
  const {
    defaultWatchlist = DEFAULT_WATCHLIST,
    enablePersistence = true
  } = options;
  
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  
  const { data: persistedWatchlist, updateData: updatePersistedData, clearData: clearPersistedData } = usePersistedCache<WatchlistItem[]>('watchlist', [], { ttl: 365 * 24 * 60 * 60 * 1000 });
  
  // Initialize watchlist
  useEffect(() => {
    const initializeWatchlist = () => {
      if (enablePersistence && persistedWatchlist.length > 0) {
        setWatchlist(persistedWatchlist);
      } else if (defaultWatchlist.length > 0) {
        const initialWatchlist = defaultWatchlist.map(symbol => ({
          symbol,
          addedAt: new Date().toISOString()
        }));
        setWatchlist(initialWatchlist);
        if (enablePersistence) {
          updatePersistedData(initialWatchlist);
        }
      }
    };

    initializeWatchlist();
  }, [persistedWatchlist, defaultWatchlist, enablePersistence, updatePersistedData]);
  
  const addToWatchlist = useCallback(async (symbol: string, name?: string, notes?: string) => {
    const cleanSymbol = symbol.toUpperCase().trim();
    
    // Check if already exists
    const exists = watchlist.find(item => item.symbol === cleanSymbol);
    if (exists) {
      throw new Error(`${cleanSymbol} is already in your watchlist`);
    }
    
    const newItem: WatchlistItem = {
      symbol: cleanSymbol,
      name,
      notes,
      addedAt: new Date().toISOString()
    };
    
    const updatedWatchlist = [...watchlist, newItem];
    setWatchlist(updatedWatchlist);
    
    if (enablePersistence) {
      updatePersistedData(updatedWatchlist);
    }
    
    return newItem;
  }, [watchlist, updatePersistedData, enablePersistence]);
  
  const removeFromWatchlist = useCallback((symbol: string) => {
    const cleanSymbol = symbol.toUpperCase().trim();
    const updatedWatchlist = watchlist.filter(item => item.symbol !== cleanSymbol);
    
    setWatchlist(updatedWatchlist);
    
    if (enablePersistence) {
      updatePersistedData(updatedWatchlist);
    }
  }, [watchlist, updatePersistedData, enablePersistence]);
  
  const updateWatchlistItem = useCallback((symbol: string, updates: Partial<Omit<WatchlistItem, 'symbol' | 'addedAt'>>) => {
    const cleanSymbol = symbol.toUpperCase().trim();
    const updatedWatchlist = watchlist.map(item => 
      item.symbol === cleanSymbol 
        ? { ...item, ...updates }
        : item
    );
    
    setWatchlist(updatedWatchlist);
    
    if (enablePersistence) {
      updatePersistedData(updatedWatchlist);
    }
  }, [watchlist, updatePersistedData, enablePersistence]);
  
  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    
    if (enablePersistence) {
      clearPersistedData();
    }
  }, [clearPersistedData, enablePersistence]);
  
  const resetToDefault = useCallback(() => {
    const defaultItems = defaultWatchlist.map(symbol => ({
      symbol,
      addedAt: new Date().toISOString()
    }));
    
    setWatchlist(defaultItems);
    
    if (enablePersistence) {
      updatePersistedData(defaultItems);
    }
  }, [defaultWatchlist, updatePersistedData, enablePersistence]);
  
  const isInWatchlist = useCallback((symbol: string) => {
    const cleanSymbol = symbol.toUpperCase().trim();
    return watchlist.some(item => item.symbol === cleanSymbol);
  }, [watchlist]);
  
  const getWatchlistItem = useCallback((symbol: string) => {
    const cleanSymbol = symbol.toUpperCase().trim();
    return watchlist.find(item => item.symbol === cleanSymbol) || null;
  }, [watchlist]);
  
  const exportWatchlist = useCallback(() => {
    const csvData = watchlist.map(item => ({
      symbol: item.symbol,
      name: item.name || '',
      addedAt: item.addedAt,
      notes: item.notes || ''
    }));
    
    return csvData;
  }, [watchlist]);
  
  const importWatchlist = useCallback((items: WatchlistItem[]) => {
    // Remove duplicates and validate
    const validItems = items
      .filter(item => item.symbol && item.symbol.trim())
      .reduce((acc: WatchlistItem[], current) => {
        const exists = acc.find(item => item.symbol === current.symbol.toUpperCase());
        if (!exists) {
          acc.push({
            ...current,
            symbol: current.symbol.toUpperCase(),
            addedAt: current.addedAt || new Date().toISOString()
          });
        }
        return acc;
      }, []);
    
    setWatchlist(validItems);
    
    if (enablePersistence) {
      updatePersistedData(validItems);
    }
    
    return validItems;
  }, [updatePersistedData, enablePersistence]);
  
  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    clearWatchlist,
    resetToDefault,
    isInWatchlist,
    getWatchlistItem,
    exportWatchlist,
    importWatchlist,
    totalItems: watchlist.length
  };
};

// Hook for watchlist settings
interface WatchlistSettings {
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  showNotifications: boolean;
  defaultView: 'grid' | 'list';
  sortBy: 'symbol' | 'addedAt' | 'price';
  sortOrder: 'asc' | 'desc';
}

const DEFAULT_SETTINGS: WatchlistSettings = {
  autoRefresh: true,
  refreshInterval: 30,
  showNotifications: false,
  defaultView: 'grid',
  sortBy: 'symbol',
  sortOrder: 'asc'
};

export const useWatchlistSettings = () => {
  const {
    data: settings,
    updateData: updateSettings,
    clearData: clearSettings
  } = usePersistedCache<WatchlistSettings>('watchlist_settings', DEFAULT_SETTINGS, {
    ttl: 365 * 24 * 60 * 60 * 1000 // 1 year
  });
  
  const updateSetting = useCallback(<K extends keyof WatchlistSettings>(
    key: K, 
    value: WatchlistSettings[K]
  ) => {
    updateSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, [updateSettings]);
  
  const resetSettings = useCallback(() => {
    updateSettings(DEFAULT_SETTINGS);
  }, [updateSettings]);
  
  return {
    settings,
    updateSetting,
    resetSettings,
    clearSettings
  };
};