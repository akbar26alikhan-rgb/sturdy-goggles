'use client';

import React from 'react';
import { CurrencySelectorProps } from '@/lib/types';

export default function CurrencySelector({ 
  selectedCurrency, 
  currencies, 
  onChange, 
  disabled = false 
}: CurrencySelectorProps) {
  return (
    <select
      value={selectedCurrency}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="px-3 py-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
    >
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.code} - {currency.name}
        </option>
      ))}
    </select>
  );
}