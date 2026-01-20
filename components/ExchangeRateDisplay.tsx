'use client';

import React from 'react';
import { ExchangeRateDisplayProps } from '@/lib/types';
import { getExchangeRateText } from '@/lib/exchangeRateApi';

export default function ExchangeRateDisplay({
  fromCurrency,
  toCurrency,
  rate,
  lastUpdated,
  loading = false
}: ExchangeRateDisplayProps) {
  if (loading) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Fetching exchange rate...</p>
      </div>
    );
  }

  if (!rate) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Select currencies to see exchange rate
        </p>
      </div>
    );
  }

  const rateText = getExchangeRateText(fromCurrency, toCurrency, rate);

  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-zinc-900 dark:text-white">
          {rateText}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Last updated: {formatLastUpdated(lastUpdated)}
        </p>
      </div>
    </div>
  );
}