'use client';

import React from 'react';
import { CurrencyInputProps } from '@/lib/types';
import CurrencySelector from './CurrencySelector';

export default function CurrencyInput({
  label,
  value,
  currency,
  currencies,
  onChange,
  onCurrencyChange,
  disabled = false
}: CurrencyInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow numbers and decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="0.00"
            disabled={disabled}
            className="flex-1 px-3 py-2 border border-zinc-300 rounded-l-md bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-400 dark:focus:ring-blue-400 dark:focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="border-l-0">
            <CurrencySelector
              selectedCurrency={currency}
              currencies={currencies}
              onChange={onCurrencyChange}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}