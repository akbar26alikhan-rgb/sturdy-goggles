'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ConverterState, 
  Currency,
  ExchangeRateResponse 
} from '@/lib/types';
import { 
  fetchSupportedCurrencies, 
  fetchExchangeRate, 
  convertCurrency 
} from '@/lib/exchangeRateApi';
import CurrencyInput from './CurrencyInput';
import ExchangeRateDisplay from './ExchangeRateDisplay';

export default function CurrencyConverter() {
  const [state, setState] = useState<ConverterState>({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    fromAmount: '',
    toAmount: '',
    rate: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const fetchRate = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: ExchangeRateResponse = await fetchExchangeRate(
        state.fromCurrency, 
        state.toCurrency
      );
      
      setState(prev => ({
        ...prev,
        rate: response.rate,
        loading: false,
        lastUpdated: new Date(response.timestamp),
        error: null
      }));
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch exchange rate',
        rate: null
      }));
    }
  }, [state.fromCurrency, state.toCurrency]);

  // Load supported currencies on component mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const supportedCurrencies = await fetchSupportedCurrencies();
        setCurrencies(supportedCurrencies);
      } catch (error) {
        console.error('Failed to load currencies:', error);
        // The API service has fallback currencies, so this shouldn't break the app
      }
    };

    loadCurrencies();
  }, []);

  // Fetch exchange rate when currencies change
  useEffect(() => {
    if (state.fromCurrency && state.toCurrency) {
      fetchRate();
    }
  }, [state.fromCurrency, state.toCurrency, fetchRate]);

  // Convert amount when fromAmount or rate changes
  useEffect(() => {
    if (state.fromAmount && state.rate) {
      const converted = convertCurrency(state.fromAmount, state.rate);
      setState(prev => ({ ...prev, toAmount: converted }));
    } else {
      setState(prev => ({ ...prev, toAmount: '' }));
    }
  }, [state.fromAmount, state.rate]);

  const handleFromAmountChange = (value: string) => {
    setState(prev => ({ ...prev, fromAmount: value }));
  };

  const handleToAmountChange = (value: string) => {
    setState(prev => ({ ...prev, toAmount: value }));
  };

  const handleFromCurrencyChange = (currency: string) => {
    setState(prev => ({ ...prev, fromCurrency: currency }));
  };

  const handleToCurrencyChange = (currency: string) => {
    setState(prev => ({ ...prev, toCurrency: currency }));
  };

  const swapCurrencies = () => {
    setState(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }));
  };

  const handleRetry = () => {
    fetchRate();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Currency Converter
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Get real-time exchange rates for accurate conversions
          </p>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-800 dark:text-red-200">
                {state.error}
              </p>
              <button
                onClick={handleRetry}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Exchange Rate Display */}
        <ExchangeRateDisplay
          fromCurrency={state.fromCurrency}
          toCurrency={state.toCurrency}
          rate={state.rate}
          lastUpdated={state.lastUpdated}
          loading={state.loading}
        />

        {/* Currency Inputs */}
        <div className="space-y-4">
          <CurrencyInput
            label="From"
            value={state.fromAmount}
            currency={state.fromCurrency}
            currencies={currencies}
            onChange={handleFromAmountChange}
            onCurrencyChange={handleFromCurrencyChange}
            disabled={state.loading}
          />

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              disabled={state.loading}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Swap currencies"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <CurrencyInput
            label="To"
            value={state.toAmount}
            currency={state.toCurrency}
            currencies={currencies}
            onChange={handleToAmountChange}
            onCurrencyChange={handleToCurrencyChange}
            disabled={state.loading}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          <p>Exchange rates are updated in real-time</p>
          <p className="mt-1">Rates provided by ExchangeRate-API</p>
        </div>
      </div>
    </div>
  );
}