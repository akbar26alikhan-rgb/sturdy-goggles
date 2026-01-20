'use client';

import { useState } from 'react';
import { WatchlistItem } from '@/lib/types';
import { useWatchlist } from '@/hooks/useWatchlist';
import StockSearch from './StockSearch';
import StockCard from './StockCard';
import { formatForCSV } from '@/lib/formatters';
import { useTheme } from '@/context/ThemeContext';

interface WatchlistManagerProps {
  className?: string;
  onSelectStock?: (symbol: string) => void;
}

export default function WatchlistManager({ className = "", onSelectStock }: WatchlistManagerProps) {
  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    clearWatchlist,
    resetToDefault,
    isInWatchlist,
    exportWatchlist,
    importWatchlist,
    totalItems
  } = useWatchlist();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const { isDark } = useTheme();

  const handleAddStock = async (symbol: string, name?: string) => {
    try {
      await addToWatchlist(symbol, name);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add stock:', error);
      // You might want to show a toast notification here
    }
  };

  const handleRemoveStock = (symbol: string) => {
    removeFromWatchlist(symbol);
  };

  const handleExportCSV = () => {
    const csvData = exportWatchlist();
    const csv = formatForCSV(csvData);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `watchlist_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImportCSV = () => {
    setImportError('');
    
    try {
      // Simple CSV parsing (for more complex CSV, you might want to use a library like PapaParse)
      const lines = importData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const symbolIndex = headers.findIndex(h => h === 'symbol');
      const nameIndex = headers.findIndex(h => h === 'name');
      
      if (symbolIndex === -1) {
        throw new Error('CSV must contain a "symbol" column');
      }
      
      const items: WatchlistItem[] = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          return {
            symbol: values[symbolIndex]?.toUpperCase() || '',
            name: nameIndex >= 0 ? values[nameIndex] : undefined,
            addedAt: new Date().toISOString()
          };
        })
        .filter(item => item.symbol); // Remove empty symbols
      
      if (items.length === 0) {
        throw new Error('No valid symbols found in CSV');
      }
      
      importWatchlist(items);
      setImportData('');
      setShowAddForm(false);
      
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to parse CSV');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Watchlist
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {totalItems} {totalItems === 1 ? 'stock' : 'stocks'} • Manage your favorite stocks
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export/Import */}
          <button
            onClick={handleExportCSV}
            disabled={watchlist.length === 0}
            className={`
              px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors
              ${watchlist.length === 0
                ? isDark 
                  ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
                : isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }
            `}
            title="Export watchlist to CSV"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          
          <label className={`
            px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors cursor-pointer
            ${isDark 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }
          `}>
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import
            <input
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          
          {/* Add Stock */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-colors
              ${isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Stock
          </button>
        </div>
      </div>

      {/* Add Stock Form */}
      {showAddForm && (
        <div className={`
          mb-6 p-4 rounded-lg border-2
          ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add Stock to Watchlist
          </h3>
          
          <div className="space-y-4">
            <StockSearch 
              onSelect={handleAddStock}
              placeholder="Search and select a stock to add..."
              className="w-full"
            />
            
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              Or import from CSV file
            </div>
            
            {importData && (
              <div className="space-y-2">
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste CSV data here (symbol,name)"
                  className={`
                    w-full h-32 p-3 rounded-lg border text-sm
                    ${isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                  `}
                />
                {importError && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{importError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleImportCSV}
                    className={`
                      px-3 py-1 rounded text-sm font-medium transition-colors
                      ${isDark 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }
                    `}
                  >
                    Import CSV Data
                  </button>
                  <button
                    onClick={() => {
                      setImportData('');
                      setImportError('');
                    }}
                    className={`
                      px-3 py-1 rounded text-sm font-medium transition-colors
                      ${isDark 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                      }
                    `}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Watchlist Actions */}
      {watchlist.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={clearWatchlist}
            className={`
              px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${isDark 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
              }
            `}
          >
            Clear All
          </button>
          
          <button
            onClick={resetToDefault}
            className={`
              px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${isDark 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }
            `}
          >
            Reset to Defaults
          </button>
        </div>
      )}

      {/* Watchlist Grid */}
      {watchlist.length === 0 ? (
        <div className={`
          text-center py-12 rounded-lg border-2 border-dashed
          ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}
        `}>
          <svg className={`mx-auto h-12 w-12 mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Your watchlist is empty
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            Add stocks to start tracking their performance
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            Add Your First Stock
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <StockCard
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
              onRemove={handleRemoveStock}
              onAddToWatchlist={handleAddStock}
              showChart={false}
              autoRefresh={true}
              className="h-full"
            />
          ))}
        </div>
      )}

      {/* Watchlist Info */}
      {watchlist.length > 0 && (
        <div className="mt-6 text-center">
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Tip: Click on any stock card to view detailed charts and analysis
          </p>
        </div>
      )}
    </div>
  );
}