'use client';

import { useState, useEffect } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useMultipleStocks } from '@/hooks/useStockData';
import StockCard from './StockCard';
import StockChart from './StockChart';
import TickerTape from './TickerTape';
import SettingsPanel from './SettingsPanel';
import { formatForCSV, formatTimeAgo } from '@/lib/formatters';
import { useTheme } from '@/context/ThemeContext';
import { TimeSeriesData } from '@/lib/types';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = "" }: DashboardProps) {
  const { watchlist } = useWatchlist();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [isOnline, setIsOnline] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const { isDark } = useTheme();
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastRefresh(new Date());
    };
    const handleOffline = () => setIsOnline(false);
    
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    checkOnlineStatus();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get symbols from watchlist
  const symbols = watchlist.map(item => item.symbol);
  
  // Fetch data for all stocks
  const { stocks, loading, errors, lastUpdated, refresh } = useMultipleStocks(symbols, {
    refreshInterval: 30
  });

  // Get selected stock data
  const selectedStockData = selectedStock ? stocks.get(selectedStock) : null;
  
  // Handle stock selection
  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  // Export all data to CSV
  const handleExportCSV = () => {
    const csvData: any[] = [];
    
    stocks.forEach((stock) => {
      csvData.push({
        symbol: stock.symbol,
        name: stock.name || '',
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap || '',
        high: stock.high,
        low: stock.low,
        open: stock.open,
        previousClose: stock.previousClose,
        timestamp: stock.timestamp
      });
    });
    
    const csv = formatForCSV(csvData);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `stocks_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calculate portfolio metrics
  const portfolioMetrics = Array.from(stocks.values()).reduce((acc, stock) => {
    acc.totalValue += stock.price;
    acc.totalChange += stock.change;
    acc.totalVolume += stock.volume;
    return acc;
  }, { totalValue: 0, totalChange: 0, totalVolume: 0 });

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${isDark ? 'bg-gray-900' : 'bg-gray-50'}
      ${className}
    `}>
      {/* Header */}
      <header className={`
        sticky top-0 z-40 border-b-2 backdrop-blur-sm
        ${isDark 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Stock Dashboard
                </h1>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center gap-2">
                {/* Online/Offline Status */}
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {/* Last Updated */}
                {lastUpdated && (
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Updated {formatTimeAgo(lastUpdated)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Export Button */}
              {stocks.size > 0 && (
                <button
                  onClick={handleExportCSV}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                  `}
                  title="Export data to CSV"
                >
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              )}
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDark 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker Tape */}
      {symbols.length > 0 && (
        <div className="border-b-2">
          <TickerTape 
            symbols={symbols}
            speed={50}
            pauseOnHover={true}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {watchlist.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <svg className={`mx-auto h-16 w-16 mb-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Welcome to your Stock Dashboard
            </h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Get started by adding stocks to your watchlist
            </p>
            <a
              href="/watchlist"
              className={`
                inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                ${isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              Add Your First Stock
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Portfolio Summary */}
            <div className={`
              p-6 rounded-xl border-2
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            `}>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Portfolio Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Stocks
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stocks.size}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Value
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${portfolioMetrics.totalValue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Change
                  </p>
                  <p className={`text-2xl font-bold ${portfolioMetrics.totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolioMetrics.totalChange >= 0 ? '+' : ''}{portfolioMetrics.totalChange.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            {selectedStock && (
              <div className={`
                p-6 rounded-xl border-2
                ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              `}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedStock} Chart
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTimeframe('1D')}
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium transition-colors
                        ${selectedTimeframe === '1D'
                          ? 'bg-blue-600 text-white'
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      1D
                    </button>
                    <button
                      onClick={() => setSelectedTimeframe('1W')}
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium transition-colors
                        ${selectedTimeframe === '1W'
                          ? 'bg-blue-600 text-white'
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      1W
                    </button>
                    <button
                      onClick={() => setSelectedTimeframe('1M')}
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium transition-colors
                        ${selectedTimeframe === '1M'
                          ? 'bg-blue-600 text-white'
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      1M
                    </button>
                  </div>
                </div>
                <StockChart
                  data={null} // This would come from the time series data
                  loading={loading}
                  config={{
                    type: 'line',
                    interval: selectedTimeframe,
                    showVolume: true,
                    showMovingAverage: true
                  }}
                  height={500}
                />
              </div>
            )}

            {/* Stocks Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Your Stocks ({stocks.size})
                </h2>
                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Updating...
                    </span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from(stocks.entries()).map(([symbol, stock]) => (
                  <div
                    key={symbol}
                    onClick={() => handleStockSelect(symbol)}
                    className="cursor-pointer"
                  >
                    <StockCard
                      symbol={symbol}
                      name={stock.name}
                      showChart={false}
                      autoRefresh={true}
                      className={`
                        hover:shadow-lg transition-all duration-300
                        ${selectedStock === symbol 
                          ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                          : ''
                        }
                      `}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Errors Display */}
            {errors.size > 0 && (
              <div className={`
                p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50
                ${isDark ? 'border-yellow-800 bg-yellow-900/20' : 'border-yellow-200 bg-yellow-50'}
              `}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  Some stocks failed to load:
                </h3>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  {Array.from(errors.entries()).map(([symbol, error]) => (
                    <li key={symbol}>
                      <strong>{symbol}:</strong> {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}