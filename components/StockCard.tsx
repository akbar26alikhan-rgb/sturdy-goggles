'use client';

import { useState, useEffect } from 'react';
import { StockQuote } from '@/lib/types';
import { useStockData } from '@/hooks/useStockData';
import { formatCurrency, formatNumber, formatPercentage, formatPriceChange, formatTimeAgo, getChangeColor, getChangeBgColor } from '@/lib/formatters';
import { useTheme } from '@/context/ThemeContext';

interface StockCardProps {
  symbol: string;
  name?: string;
  onRemove?: (symbol: string) => void;
  onAddToWatchlist?: (symbol: string) => void;
  className?: string;
  showChart?: boolean;
  autoRefresh?: boolean;
}

export default function StockCard({ 
  symbol, 
  name, 
  onRemove, 
  onAddToWatchlist, 
  className = "",
  showChart = false,
  autoRefresh = true
}: StockCardProps) {
  const { quote, loading, error, lastUpdated, refresh } = useStockData(symbol, {
    refreshInterval: autoRefresh ? 30 : 0,
    enableTimeSeries: showChart
  });
  
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDark } = useTheme();

  // Check if stock is in watchlist (this would typically come from watchlist hook)
  useEffect(() => {
    // This would integrate with the watchlist hook
    // For now, we'll simulate it
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some((item: any) => item.symbol === symbol));
  }, [symbol]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleWatchlist = () => {
    if (isInWatchlist) {
      onRemove?.(symbol);
      setIsInWatchlist(false);
    } else {
      onAddToWatchlist?.(symbol);
      setIsInWatchlist(true);
    }
  };

  if (loading && !quote) {
    return <StockCardSkeleton className={className} />;
  }

  if (error && !quote) {
    return (
      <div className={`
        p-6 rounded-xl border-2 border-red-200 dark:border-red-800
        ${isDark ? 'bg-red-900/20' : 'bg-red-50'}
        ${className}
      `}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
            {symbol}
          </h3>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${isDark 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
              ${isRefreshing ? 'animate-spin' : ''}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className={`
        p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        ${className}
      `}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          No data available for {symbol}
        </div>
      </div>
    );
  }

  const priceChange = formatPriceChange(quote.change, quote.changePercent);
  const displayName = name || quote.name || symbol;

  return (
    <div className={`
      p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg
      ${isDark 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
      }
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {symbol}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {displayName}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${isDark 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
              ${isRefreshing ? 'animate-spin' : ''}
            `}
            title="Refresh data"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Watchlist toggle */}
          <button
            onClick={handleToggleWatchlist}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${isInWatchlist
                ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                : isDark 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
            `}
            title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <svg className="w-4 h-4" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Price and Change */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(quote.price)}
          </span>
          <div className={`
            px-3 py-1 rounded-full text-sm font-semibold
            ${priceChange.isPositive 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
              : priceChange.isNeutral
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }
          `}>
            {priceChange.value}
          </div>
        </div>
        
        {lastUpdated && (
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Last updated {formatTimeAgo(lastUpdated)}
          </p>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Open
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(quote.open)}
            </p>
          </div>
          
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              High
            </p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(quote.high)}
            </p>
          </div>
          
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Low
            </p>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(quote.low)}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Volume
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatNumber(quote.volume, { abbreviation: true })}
            </p>
          </div>
          
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Market Cap
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {quote.marketCap ? formatNumber(quote.marketCap, { abbreviation: true }) : 'N/A'}
            </p>
          </div>
          
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Prev Close
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(quote.previousClose)}
            </p>
          </div>
        </div>
      </div>

      {/* Loading indicator for background updates */}
      {loading && quote && (
        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="w-3 h-3 border border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          Updating...
        </div>
      )}

      {/* Error indicator for background updates */}
      {error && quote && (
        <div className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// Skeleton loading component
function StockCardSkeleton({ className = "" }: { className?: string }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`
      p-6 rounded-xl border-2 animate-pulse
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      ${className}
    `}>
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={`h-6 rounded w-20 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        <div className="flex gap-2">
          <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {/* Price skeleton */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <div className={`h-8 rounded w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-6 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        <div className={`h-3 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className={`h-3 rounded w-12 mb-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className={`h-3 rounded w-16 mb-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}