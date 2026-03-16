// Stock Types
export interface Stock {
  id: number;
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector?: string;
  industry?: string;
  marketCap?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockWithScore extends Stock {
  scores: Score[];
  currentPrice?: number;
  dayChange?: number;
  dayChangePercent?: number;
  volume?: number;
  avgVolume20?: number;
  dma50?: number;
  dma200?: number;
  peRatio?: number;
  pbRatio?: number;
  debtToEquity?: number;
  totalScore: number;
  tradeGrade: TradeGrade;
}

// Price Data Types
export interface DailyPrice {
  id: number;
  stockId: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  deliveryVolume?: number;
  deliveryPercent?: number;
}

export interface OHLCV {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Fundamental Data Types
export interface Fundamental {
  id: number;
  stockId: number;
  quarter: string;
  year: number;
  quarterNumber: number;
  revenue?: number;
  profit?: number;
  eps?: number;
  peRatio?: number;
  pbRatio?: number;
  debtToEquity?: number;
  roe?: number;
  roic?: number;
  operatingCashflow?: number;
  interestCoverage?: number;
  salesGrowthYoy?: number;
  profitGrowthYoy?: number;
  epsGrowthYoy?: number;
}

// Score Types
export interface Score {
  id: number;
  stockId: number;
  scoreDate: string;
  trendScore: number;
  volumeScore: number;
  breakoutScore: number;
  growthScore: number;
  financialScore: number;
  valuationScore: number;
  institutionalScore: number;
  sectorScore: number;
  totalScore: number;
  tradeGrade: TradeGrade;
  dma50?: number | null;
  dma200?: number | null;
  currentPrice?: number | null;
  dayChange?: number | null;
  volume?: number | null;
  avgVolume20?: number | null;
  resistance?: number | null;
  support?: number | null;
  calculatedAt: string;
}

export interface ScoreBreakdown {
  trend: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  volume: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  breakout: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  growth: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  financial: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  valuation: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  institutional: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  sector: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
}

// Trade Grades
export type TradeGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface TradeGradeInfo {
  grade: TradeGrade;
  label: string;
  color: string;
  bgColor: string;
}

// Filter Types
export type StockFilter = {
  exchange?: 'NSE' | 'BSE';
  sector?: string;
  marketCap?: 'large' | 'mid' | 'small';
  breakout?: boolean;
  above200DMA?: boolean;
  minScore?: number;
  maxScore?: number;
};

export type SortOption = 'score' | 'price' | 'change' | 'volume' | 'name';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Alert Types
export interface Alert {
  id: number;
  stockId?: number;
  stock?: Stock;
  alertType: 'score_above' | 'breakout' | 'volume_spike';
  threshold?: number;
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  createdAt: string;
}

export interface CreateAlertInput {
  stockId?: number;
  alertType: 'score_above' | 'breakout' | 'volume_spike';
  threshold?: number;
}

// Sector Types
export interface Sector {
  id: number;
  name: string;
  indexValue?: number;
  dayChange?: number;
  avgScore?: number;
  updatedAt: string;
  createdAt?: string;
}

// Market Data Types (from external APIs)
export interface LiveQuote {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  deliveryVolume?: number;
  deliveryPercent?: number;
  avgVolume?: number;
  week52High?: number;
  week52Low?: number;
  marketCap?: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  sector?: string;
  industry?: string;
}

// Technical Indicators
export interface TechnicalIndicators {
  rsi?: number | null;
  macd?: {
    line: number;
    signal: number;
    histogram: number;
  };
  ema20?: number | null;
  ema50?: number | null;
  ema200?: number | null;
  sma50?: number | null;
  sma200?: number | null;
  atr?: number | null;
  adx?: number | null;
}

// Stock Detail with all info
export interface StockDetail {
  stock: Stock;
  quote: LiveQuote;
  prices: OHLCV[];
  fundamentals: Fundamental[];
  scores: Score[];
  technicalIndicators: TechnicalIndicators;
  scoreBreakdown: ScoreBreakdown;
}

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark';
  refreshInterval: number;
  defaultFilters: StockFilter;
  watchlist: string[];
}
