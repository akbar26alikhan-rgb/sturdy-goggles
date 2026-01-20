'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResult } from '@/lib/types';
import { useStockSearch } from '@/hooks/useStockData';
import { isValidStockSymbol, normalizeSymbol } from '@/lib/formatters';
import { useTheme } from '@/context/ThemeContext';

interface StockSearchProps {
  onSelect: (symbol: string, name?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function StockSearch({ 
  onSelect, 
  placeholder = "Search stocks (e.g., AAPL, GOOGL, RELIANCE.NS)",
  disabled = false,
  className = ""
}: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { results, loading, error, search, clearSearch } = useStockSearch();
  const { isDark } = useTheme();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      clearSearch();
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      search(query);
      setShowResults(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search, clearSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        } else if (isValidStockSymbol(query)) {
          handleDirectInput(query);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    const symbol = result.symbol.toUpperCase();
    setQuery(symbol);
    setShowResults(false);
    setSelectedIndex(-1);
    onSelect(symbol, result.name);
  };

  const handleDirectInput = (symbol: string) => {
    const cleanSymbol = normalizeSymbol(symbol);
    setQuery(cleanSymbol);
    setShowResults(false);
    setSelectedIndex(-1);
    onSelect(cleanSymbol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValidStockSymbol(query)) {
      handleDirectInput(query);
    } else if (results.length > 0) {
      handleSelect(results[0]);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 pr-12 rounded-lg border-2 
              ${isDark 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
              focus:outline-none focus:ring-0 transition-colors duration-200
            `}
          />
          
          {/* Search icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg 
              className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={`
                absolute right-3 top-1/2 transform -translate-y-1/2 
                p-1 rounded-full transition-colors duration-200
                ${isDark 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search results dropdown */}
      {showResults && (
        <div
          ref={resultsRef}
          className={`
            absolute top-full left-0 right-0 mt-2 rounded-lg border-2 shadow-lg z-50 max-h-96 overflow-y-auto
            ${isDark 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
            }
          `}
        >
          {loading && (
            <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </div>
            </div>
          )}

          {error && (
            <div className={`p-4 text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </div>
          )}

          {!loading && !error && results.length === 0 && query.length >= 2 && (
            <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No stocks found for "{query}"
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.symbol}
                  onClick={() => handleSelect(result)}
                  className={`
                    w-full px-4 py-3 text-left transition-colors duration-150
                    ${selectedIndex === index
                      ? isDark 
                        ? 'bg-blue-900/50 text-blue-200' 
                        : 'bg-blue-50 text-blue-900'
                      : isDark 
                        ? 'hover:bg-gray-700 text-gray-100' 
                        : 'hover:bg-gray-50 text-gray-900'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold">
                        {highlightMatch(result.symbol, query)}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {highlightMatch(result.name || '', query)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {result.region} • {result.type}
                        {result.currency && ` • ${result.currency}`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Direct symbol input suggestion */}
          {query.length > 0 && isValidStockSymbol(query) && (
            <div className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <button
                onClick={() => handleDirectInput(query)}
                className={`
                  w-full px-4 py-3 text-left transition-colors duration-150
                  ${isDark 
                    ? 'hover:bg-gray-700 text-gray-100' 
                    : 'hover:bg-gray-50 text-gray-900'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {query.toUpperCase()}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Add as custom symbol
                    </div>
                  </div>
                  <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}