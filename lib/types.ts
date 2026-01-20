export interface Currency {
  code: string;
  name: string;
}

export interface ExchangeRateResponse {
  base: string;
  target: string;
  rate: number;
  timestamp: number;
  date: string;
}

export interface SupportedCurrencies {
  [key: string]: string;
}

export interface ConverterState {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  rate: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface CurrencyInputProps {
  label: string;
  value: string;
  currency: string;
  currencies: Currency[];
  onChange: (value: string) => void;
  onCurrencyChange: (currency: string) => void;
  disabled?: boolean;
}

export interface CurrencySelectorProps {
  selectedCurrency: string;
  currencies: Currency[];
  onChange: (currency: string) => void;
  disabled?: boolean;
}

export interface ExchangeRateDisplayProps {
  fromCurrency: string;
  toCurrency: string;
  rate: number | null;
  lastUpdated: Date | null;
  loading?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}