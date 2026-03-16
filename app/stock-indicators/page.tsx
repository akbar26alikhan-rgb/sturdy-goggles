"use client";

import { useState } from "react";
import { IndicatorConfig, defaultIndicators } from "@/lib/indicators";
import MovingAverageConfig from "@/components/MovingAverageConfig";
import RSIConfig from "@/components/RSIConfig";
import MACDConfig from "@/components/MACDConfig";
import BollingerBandsConfig from "@/components/BollingerBandsConfig";
import StochasticConfig from "@/components/StochasticConfig";
import IchimokuConfig from "@/components/IchimokuConfig";
import ADXConfig from "@/components/ADXConfig";
import VWAPConfig from "@/components/VWAPConfig";
import FibonacciConfig from "@/components/FibonacciConfig";
import ParabolicSARConfig from "@/components/ParabolicSARConfig";
import IndicatorSummary from "@/components/IndicatorSummary";
import StopLossFramework from "@/components/StopLossFramework";

export default function StockIndicatorsPage() {
  const [activeIndicator, setActiveIndicator] = useState<string>("ma");
  const [indicators, setIndicators] = useState<IndicatorConfig>(defaultIndicators);

  const updateIndicator = (key: keyof IndicatorConfig, value: any) => {
    setIndicators((prev) => ({ ...prev, [key]: value }));
  };

  const indicatorTabs = [
    { id: "ma", name: "Moving Average", icon: "📈" },
    { id: "rsi", name: "RSI", icon: "📊" },
    { id: "macd", name: "MACD", icon: "📉" },
    { id: "bb", name: "Bollinger Bands", icon: "🎯" },
    { id: "stoch", name: "Stochastic", icon: "🔄" },
    { id: "ichimoku", name: "Ichimoku", icon: "☁️" },
    { id: "adx", name: "ADX", icon: "📐" },
    { id: "vwap", name: "VWAP", icon: "💹" },
    { id: "fib", name: "Fibonacci", icon: "🔢" },
    { id: "sar", name: "Parabolic SAR", icon: "⚡" },
  ];

  const renderIndicatorConfig = () => {
    switch (activeIndicator) {
      case "ma":
        return <MovingAverageConfig config={indicators.movingAverage} onChange={(v) => updateIndicator("movingAverage", v)} />;
      case "rsi":
        return <RSIConfig config={indicators.rsi} onChange={(v) => updateIndicator("rsi", v)} />;
      case "macd":
        return <MACDConfig config={indicators.macd} onChange={(v) => updateIndicator("macd", v)} />;
      case "bb":
        return <BollingerBandsConfig config={indicators.bollingerBands} onChange={(v) => updateIndicator("bollingerBands", v)} />;
      case "stoch":
        return <StochasticConfig config={indicators.stochastic} onChange={(v) => updateIndicator("stochastic", v)} />;
      case "ichimoku":
        return <IchimokuConfig config={indicators.ichimoku} onChange={(v) => updateIndicator("ichimoku", v)} />;
      case "adx":
        return <ADXConfig config={indicators.adx} onChange={(v) => updateIndicator("adx", v)} />;
      case "vwap":
        return <VWAPConfig config={indicators.vwap} onChange={(v) => updateIndicator("vwap", v)} />;
      case "fib":
        return <FibonacciConfig config={indicators.fibonacci} onChange={(v) => updateIndicator("fibonacci", v)} />;
      case "sar":
        return <ParabolicSARConfig config={indicators.parabolicSAR} onChange={(v) => updateIndicator("parabolicSAR", v)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 text-white py-6 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                🇮🇳 Indian Stock Market Indicators
              </h1>
              <p className="text-blue-100 mt-2">
                Profitable Technical Analysis Settings for NSE/BSE Trading
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Markets: Nifty | BankNifty | Sensex</div>
              <div className="text-xs opacity-60">Optimized for Indian Markets</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Indicator Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 sticky top-4">
              <h2 className="text-white font-semibold mb-4 text-lg">Indicators</h2>
              <nav className="space-y-2">
                {indicatorTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveIndicator(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      activeIndicator === tab.id
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={() => setActiveIndicator("summary")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    activeIndicator === "summary"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-xl">📋</span>
                  <span className="font-medium">Quick Reference</span>
                </button>
                <button
                  onClick={() => setActiveIndicator("stoploss")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 mt-2 ${
                    activeIndicator === "stoploss"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-xl">🛡️</span>
                  <span className="font-medium">Stop-Loss Framework</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeIndicator === "summary" ? (
              <IndicatorSummary indicators={indicators} />
            ) : activeIndicator === "stoploss" ? (
              <StopLossFramework />
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {indicatorTabs.find((t) => t.id === activeIndicator)?.icon}
                    {indicatorTabs.find((t) => t.id === activeIndicator)?.name} Configuration
                  </h2>
                </div>
                <div className="p-6">
                  {renderIndicatorConfig()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-white/60 py-6 mt-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            ⚠️ Disclaimer: These settings are based on historical backtests and community research. 
            Always do your own research and risk management before trading.
          </p>
          <p className="text-xs mt-2 opacity-50">
            Sources: Zerodha Backtest 2023, NSE Studies, TradingView Community, Quantified Trading
          </p>
        </div>
      </footer>
    </div>
  );
}
