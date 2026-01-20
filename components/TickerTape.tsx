'use client';

import { useState, useEffect } from 'react';
import { useMultipleStocks } from '@/hooks/useStockData';
import { formatCurrency, formatPercentage, getChangeColor } from '@/lib/formatters';
import { useTheme } from '@/context/ThemeContext';

interface TickerTapeProps {
  symbols: string[];
  className?: string;
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
}

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function TickerTape({ 
  symbols, 
  className = "",
  speed = 50,
  pauseOnHover = true
}: TickerTapeProps) {
  const { stocks, loading } = useMultipleStocks(symbols);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const { isDark } = useTheme();

  // Convert stocks map to ticker items array
  useEffect(() => {
    const updateTickerItems = () => {
      const items: TickerItem[] = [];
      
      symbols.forEach(symbol => {
        const stock = stocks.get(symbol);
        if (stock) {
          items.push({
            symbol: stock.symbol,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent
          });
        }
      });
      
      setTickerItems(items);
    };

    updateTickerItems();
  }, [stocks, symbols]);

  if (loading && tickerItems.length === 0) {
    return <TickerTapeSkeleton className={className} />;
  }

  if (tickerItems.length === 0) {
    return null;
  }

  // Duplicate items for infinite scroll effect
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div 
      className={`
        w-full overflow-hidden border-b-2
        ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        ${className}
      `}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div 
        className={`
          flex items-center gap-8 py-3 whitespace-nowrap
          ${!isPaused ? 'animate-scroll' : ''}
        `}
        style={{
          animationDuration: `${(duplicatedItems.length * 200) / speed}s`, // Adjust speed
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {duplicatedItems.map((item, index) => (
          <TickerItem key={`${item.symbol}-${index}`} item={item} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function TickerItem({ item, isDark }: { item: TickerItem; isDark: boolean }) {
  const changeColor = getChangeColor(item.change);

  return (
    <div className="flex items-center gap-4">
      {/* Symbol */}
      <span className={`font-bold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {item.symbol}
      </span>
      
      {/* Price */}
      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {formatCurrency(item.price)}
      </span>
      
      {/* Change */}
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${changeColor}`}>
          {item.change > 0 ? '+' : ''}{formatCurrency(item.change)}
        </span>
        <span className={`text-xs ${changeColor}`}>
          ({item.changePercent > 0 ? '+' : ''}{formatPercentage(item.changePercent)})
        </span>
        
        {/* Arrow indicator */}
        {item.change > 0 ? (
          <svg className={`w-3 h-3 ${changeColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : item.change < 0 ? (
          <svg className={`w-3 h-3 ${changeColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : null}
      </div>
      
      {/* Separator */}
      <div className={`w-px h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
    </div>
  );
}

// Skeleton component
function TickerTapeSkeleton({ className = "" }: { className?: string }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`
      w-full overflow-hidden border-b-2
      ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
      ${className}
    `}>
      <div className="flex items-center gap-8 py-3 whitespace-nowrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`h-4 w-12 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-16 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-20 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`w-px h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}