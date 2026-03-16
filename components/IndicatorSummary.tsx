"use client";

import { IndicatorConfig } from "@/lib/indicators";

interface Props {
  indicators: IndicatorConfig;
}

export default function IndicatorSummary({ indicators }: Props) {
  const indicatorCards = [
    {
      id: "ma",
      name: "Moving Average",
      icon: "📈",
      color: "blue",
      settings: `${indicators.movingAverage.shortTerm.period}-${indicators.movingAverage.shortTerm.type} / ${indicators.movingAverage.crossover.fastPeriod}-${indicators.movingAverage.crossover.fastType} & ${indicators.movingAverage.crossover.slowPeriod}-${indicators.movingAverage.crossover.slowType}`,
      stopLoss: `Long: ${indicators.movingAverage.stopLossLong} | Short: ${indicators.movingAverage.stopLossShort}`,
      enabled: indicators.movingAverage.shortTerm.enabled || indicators.movingAverage.crossover.enabled,
    },
    {
      id: "rsi",
      name: "RSI",
      icon: "📊",
      color: "cyan",
      settings: `${indicators.rsi.period}-period | Oversold: ${indicators.rsi.oversoldThreshold} | Overbought: ${indicators.rsi.overboughtThreshold}`,
      stopLoss: indicators.rsi.stopLossRule,
      enabled: indicators.rsi.enabled,
    },
    {
      id: "macd",
      name: "MACD",
      icon: "📉",
      color: "purple",
      settings: `${indicators.macd.fastEMA},${indicators.macd.slowEMA},${indicators.macd.signalPeriod}`,
      stopLoss: indicators.macd.stopLossRule,
      enabled: indicators.macd.enabled,
    },
    {
      id: "bb",
      name: "Bollinger Bands",
      icon: "🎯",
      color: "indigo",
      settings: `${indicators.bollingerBands.period}-SMA | ${indicators.bollingerBands.stdDev} Std Dev`,
      stopLoss: indicators.bollingerBands.stopLossRule,
      enabled: indicators.bollingerBands.enabled,
    },
    {
      id: "stoch",
      name: "Stochastic",
      icon: "🔄",
      color: "teal",
      settings: `%K:${indicators.stochastic.kPeriod} %D:${indicators.stochastic.dPeriod} Smooth:${indicators.stochastic.smoothing}`,
      stopLoss: indicators.stochastic.stopLossRule,
      enabled: indicators.stochastic.enabled,
    },
    {
      id: "ichimoku",
      name: "Ichimoku",
      icon: "☁️",
      color: "sky",
      settings: `Tenkan:${indicators.ichimoku.tenkan} Kijun:${indicators.ichimoku.kijun} Senkou:${indicators.ichimoku.senkou}`,
      stopLoss: indicators.ichimoku.stopLossRule,
      enabled: indicators.ichimoku.enabled,
    },
    {
      id: "adx",
      name: "ADX",
      icon: "📐",
      color: "violet",
      settings: `${indicators.adx.period}-period | Trend {'>'}${indicators.adx.trendThreshold} | Weak {'<'}${indicators.adx.weakTrendThreshold}`,
      stopLoss: indicators.adx.stopLossRule,
      enabled: indicators.adx.enabled,
    },
    {
      id: "vwap",
      name: "VWAP",
      icon: "💹",
      color: "orange",
      settings: `${indicators.vwap.type} | Volume {'>'}${indicators.vwap.volumeThreshold}× avg`,
      stopLoss: indicators.vwap.stopLossRule,
      enabled: indicators.vwap.enabled,
    },
    {
      id: "fib",
      name: "Fibonacci",
      icon: "🔢",
      color: "amber",
      settings: `Primary: ${indicators.fibonacci.primaryLevels.join(", ")}`,
      stopLoss: indicators.fibonacci.stopLossRule,
      enabled: indicators.fibonacci.enabled,
    },
    {
      id: "sar",
      name: "Parabolic SAR",
      icon: "⚡",
      color: "pink",
      settings: `Step: ${indicators.parabolicSAR.step} | Max: ${indicators.parabolicSAR.maximum}`,
      stopLoss: indicators.parabolicSAR.stopLossRule,
      enabled: indicators.parabolicSAR.enabled,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      blue: { bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-800", badge: "bg-blue-500" },
      cyan: { bg: "from-cyan-50 to-cyan-100", border: "border-cyan-200", text: "text-cyan-800", badge: "bg-cyan-500" },
      purple: { bg: "from-purple-50 to-purple-100", border: "border-purple-200", text: "text-purple-800", badge: "bg-purple-500" },
      indigo: { bg: "from-indigo-50 to-indigo-100", border: "border-indigo-200", text: "text-indigo-800", badge: "bg-indigo-500" },
      teal: { bg: "from-teal-50 to-teal-100", border: "border-teal-200", text: "text-teal-800", badge: "bg-teal-500" },
      sky: { bg: "from-sky-50 to-sky-100", border: "border-sky-200", text: "text-sky-800", badge: "bg-sky-500" },
      violet: { bg: "from-violet-50 to-violet-100", border: "border-violet-200", text: "text-violet-800", badge: "bg-violet-500" },
      orange: { bg: "from-orange-50 to-orange-100", border: "border-orange-200", text: "text-orange-800", badge: "bg-orange-500" },
      amber: { bg: "from-amber-50 to-amber-100", border: "border-amber-200", text: "text-amber-800", badge: "bg-amber-500" },
      pink: { bg: "from-pink-50 to-pink-100", border: "border-pink-200", text: "text-pink-800", badge: "bg-pink-500" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          📋 Quick Reference Guide
        </h2>
        <p className="text-slate-300 mt-2">
          All indicator settings at a glance for quick trading decisions
        </p>
      </div>

      {/* Indicator Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {indicatorCards.map((indicator) => {
          const colors = getColorClasses(indicator.color);
          return (
            <div
              key={indicator.id}
              className={`bg-gradient-to-br ${colors.bg} rounded-xl p-5 border-2 ${colors.border} transition-all hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{indicator.icon}</span>
                  <div>
                    <h3 className={`font-bold ${colors.text}`}>{indicator.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${indicator.enabled ? colors.badge : "bg-gray-400"}`}>
                      {indicator.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white/60 rounded-lg p-2">
                  <div className="text-xs text-slate-500 font-medium">Settings</div>
                  <div className="text-sm font-semibold text-slate-700">{indicator.settings}</div>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <div className="text-xs text-slate-500 font-medium">Stop-Loss</div>
                  <div className="text-sm text-slate-700">{indicator.stopLoss}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cheat Sheet */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🎯 Trading Cheat Sheet
          </h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                🟢 Bullish Confluence (STRONG BUY)
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Price above 20-EMA and 50-SMA
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  RSI {'>'} 38 and rising
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  MACD histogram increasing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  ADX {'>'} 25 with +DI {'>'} -DI
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Volume {'>'} 1.5× average
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                🔴 Bearish Confluence (STRONG SELL)
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✓</span>
                  Price below 20-EMA and 50-SMA
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✓</span>
                  RSI {'<'} 62 and falling
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✓</span>
                  MACD histogram decreasing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✓</span>
                  ADX {'>'} 25 with -DI {'>'} +DI
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✓</span>
                  Price below VWAP
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Market Hours */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          🕐 Indian Market Hours (IST)
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">9:15</div>
            <div className="text-sm text-slate-300">Market Open</div>
            <div className="text-xs text-slate-400 mt-1">High volatility</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">9:30-11:30</div>
            <div className="text-sm text-slate-300">Best Trading</div>
            <div className="text-xs text-slate-400 mt-1">High volume</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">11:30-13:30</div>
            <div className="text-sm text-slate-300">Lunch Lull</div>
            <div className="text-xs text-slate-400 mt-1">Low volume</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">15:30</div>
            <div className="text-sm text-slate-300">Market Close</div>
            <div className="text-xs text-slate-400 mt-1">Square off</div>
          </div>
        </div>
      </div>
    </div>
  );
}
