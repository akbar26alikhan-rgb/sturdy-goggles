export interface MovingAverageConfig {
  shortTerm: {
    enabled: boolean;
    period: number;
    type: "EMA" | "SMA";
  };
  crossover: {
    enabled: boolean;
    fastPeriod: number;
    fastType: "EMA" | "SMA";
    slowPeriod: number;
    slowType: "EMA" | "SMA";
  };
  stopLossLong: string;
  stopLossShort: string;
  notes: string;
}

export interface RSIConfig {
  enabled: boolean;
  period: number;
  oversoldThreshold: number;
  overboughtThreshold: number;
  stopLossRule: string;
  notes: string;
}

export interface MACDConfig {
  enabled: boolean;
  fastEMA: number;
  slowEMA: number;
  signalPeriod: number;
  confirmationRule: string;
  stopLossRule: string;
  notes: string;
}

export interface BollingerBandsConfig {
  enabled: boolean;
  period: number;
  stdDev: number;
  strategy: string;
  stopLossRule: string;
  notes: string;
}

export interface StochasticConfig {
  enabled: boolean;
  kPeriod: number;
  dPeriod: number;
  smoothing: number;
  signalRule: string;
  stopLossRule: string;
  notes: string;
}

export interface IchimokuConfig {
  enabled: boolean;
  tenkan: number;
  kijun: number;
  senkou: number;
  confirmationRule: string;
  stopLossRule: string;
  notes: string;
}

export interface ADXConfig {
  enabled: boolean;
  period: number;
  trendThreshold: number;
  weakTrendThreshold: number;
  signalRule: string;
  stopLossRule: string;
  notes: string;
}

export interface VWAPConfig {
  enabled: boolean;
  type: "Intraday" | "Session" | "Custom";
  volumeThreshold: number;
  signalRule: string;
  stopLossRule: string;
  notes: string;
}

export interface FibonacciConfig {
  enabled: boolean;
  primaryLevels: string[];
  confirmationRule: string;
  stopLossRule: string;
  notes: string;
}

export interface ParabolicSARConfig {
  enabled: boolean;
  step: number;
  maximum: number;
  stopLossRule: string;
  notes: string;
}

export interface StopLossFramework {
  volatilityBased: string;
  supportResistance: string;
  hybridSL: string;
}

export interface IndicatorConfig {
  movingAverage: MovingAverageConfig;
  rsi: RSIConfig;
  macd: MACDConfig;
  bollingerBands: BollingerBandsConfig;
  stochastic: StochasticConfig;
  ichimoku: IchimokuConfig;
  adx: ADXConfig;
  vwap: VWAPConfig;
  fibonacci: FibonacciConfig;
  parabolicSAR: ParabolicSARConfig;
  stopLoss: StopLossFramework;
}

export const defaultIndicators: IndicatorConfig = {
  movingAverage: {
    shortTerm: {
      enabled: true,
      period: 13,
      type: "EMA",
    },
    crossover: {
      enabled: true,
      fastPeriod: 20,
      fastType: "EMA",
      slowPeriod: 50,
      slowType: "SMA",
    },
    stopLossLong: "Below 50-SMA",
    stopLossShort: "Above 20-EMA",
    notes: "Zerodha Backtest 2023 showed 58% win rate in Nifty with 20-EMA & 50-SMA crossover",
  },
  rsi: {
    enabled: true,
    period: 10,
    oversoldThreshold: 38,
    overboughtThreshold: 62,
    stopLossRule: "Exit if RSI reverses >10 points from extreme (e.g., long trade if RSI=38 → exit at RSI>48)",
    notes: "10-period RSI reduces lag in volatile Indian markets. NSE study on mid-caps supports 38/62 thresholds.",
  },
  macd: {
    enabled: true,
    fastEMA: 8,
    slowEMA: 17,
    signalPeriod: 9,
    confirmationRule: "Require histogram > previous 3 bars",
    stopLossRule: "Below Signal Line + 0.5×ATR(14)",
    notes: "8/17/9 settings optimal for Nifty intraday - r/IndianStreetBets backtests",
  },
  bollingerBands: {
    enabled: true,
    period: 18,
    stdDev: 1.8,
    strategy: "Buy when price closes below lower band + RSI < 40",
    stopLossRule: "Mid-band (18-SMA)",
    notes: "18-period + 1.8 Std Dev reduces whipsaws in Indian indices - Quantified Trading GitHub",
  },
  stochastic: {
    enabled: true,
    kPeriod: 10,
    dPeriod: 6,
    smoothing: 6,
    signalRule: "Buy when %K crosses %D below 25",
    stopLossRule: "Below prior candle low if %K reverses above 50",
    notes: "10/6/6 settings from TradingView community consensus for Indian markets",
  },
  ichimoku: {
    enabled: true,
    tenkan: 9,
    kijun: 26,
    senkou: 52,
    confirmationRule: "Chikou Span > Price (26 periods ago) + Price > Cloud",
    stopLossRule: "Below Kijun-Sen line",
    notes: "Standard settings (9/26/52) work well for Indian stocks and indices",
  },
  adx: {
    enabled: true,
    period: 14,
    trendThreshold: 25,
    weakTrendThreshold: 20,
    signalRule: "ADX(14) > 25 + +DI > -DI (Trend confirmation)",
    stopLossRule: "If ADX drops below 20 → Exit (indicates trend weakness)",
    notes: "Use ADX to confirm trend strength before entering positions",
  },
  vwap: {
    enabled: true,
    type: "Intraday",
    volumeThreshold: 1.5,
    signalRule: "Buy when price crosses VWAP + 1 Std Dev with volume spike",
    stopLossRule: "Below VWAP",
    notes: "VWAP + Volume > 1.5×20-day avg for intraday confirmation",
  },
  fibonacci: {
    enabled: true,
    primaryLevels: ["38.2%", "61.8%"],
    confirmationRule: "RSI > 50 at 61.8% level (StockEdge data)",
    stopLossRule: "1% below Fibonacci level",
    notes: "38.2% for shallow pullbacks, 61.8% for deep pullbacks in trending markets",
  },
  parabolicSAR: {
    enabled: true,
    step: 0.01,
    maximum: 0.2,
    stopLossRule: "SAR dot itself (trailing stop)",
    notes: "Aggressive settings (0.01/0.2) work well for Indian small-caps",
  },
  stopLoss: {
    volatilityBased: "1.5×ATR(14) below entry for swing trades",
    supportResistance: "Below key technical levels (e.g., Pivot Points, Fibonacci)",
    hybridSL: "Max 2% capital loss OR indicator-based SL (whichever is tighter)",
  },
};
