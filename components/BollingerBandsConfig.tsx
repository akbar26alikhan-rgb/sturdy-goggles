"use client";

import { BollingerBandsConfig as BBConfigType } from "@/lib/indicators";

interface Props {
  config: BBConfigType;
  onChange: (config: BBConfigType) => void;
}

export default function BollingerBandsConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof BBConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Bollinger Bands</h3>
            <p className="text-slate-500 text-sm">Volatility bands for mean reversion</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig("enabled", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Settings */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Optimized Settings
          <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">Reduces Whipsaws</span>
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              SMA Period
            </label>
            <input
              type="number"
              value={config.period}
              onChange={(e) => updateConfig("period", parseInt(e.target.value))}
              className="w-full px-4 py-3 text-xl font-bold text-indigo-700 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <p className="text-xs text-slate-500 mt-1">Middle band basis</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Standard Deviations
            </label>
            <input
              type="number"
              step="0.1"
              value={config.stdDev}
              onChange={(e) => updateConfig("stdDev", parseFloat(e.target.value))}
              className="w-full px-4 py-3 text-xl font-bold text-blue-700 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <p className="text-xs text-slate-500 mt-1">Band width multiplier</p>
          </div>
        </div>
      </div>

      {/* Visual Bands */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">Bollinger Bands Structure</h4>
        <div className="relative h-48 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          {/* Upper Band */}
          <div className="absolute left-0 right-0 top-8 h-0 border-t-2 border-dashed border-green-500"></div>
          <div className="absolute right-2 top-5 text-xs text-green-600 font-semibold">
            Upper Band (+{config.stdDev}σ)
          </div>
          
          {/* Middle Band (SMA) */}
          <div className="absolute left-0 right-0 top-1/2 h-0 border-t-2 border-blue-500"></div>
          <div className="absolute right-2 top-1/2 -mt-3 text-xs text-blue-600 font-semibold">
            {config.period}-SMA
          </div>
          
          {/* Lower Band */}
          <div className="absolute left-0 right-0 bottom-8 h-0 border-t-2 border-dashed border-red-500"></div>
          <div className="absolute right-2 bottom-5 text-xs text-red-600 font-semibold">
            Lower Band (-{config.stdDev}σ)
          </div>
          
          {/* Price movement visualization */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 30 80 Q 100 40, 170 60 T 310 30 T 450 90 T 590 50"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
            />
            <circle cx="310" cy="30" r="6" fill="#22c55e" />
            <circle cx="450" cy="90" r="6" fill="#ef4444" />
          </svg>
          
          {/* Buy/Sell labels */}
          <div className="absolute left-2 top-20 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
            SELL Zone
          </div>
          <div className="absolute left-2 bottom-20 bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
            BUY Zone
          </div>
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          🎯 Trading Strategy
        </h4>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 text-green-700 rounded-full w-12 h-12 flex items-center justify-center text-xl shrink-0">
                📉
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-lg">Mean Reversion Buy</div>
                <p className="text-slate-600">{config.strategy}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Price below lower band</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">RSI &lt; 40</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 text-red-700 rounded-full w-12 h-12 flex items-center justify-center text-xl shrink-0">
                📈
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-lg">Mean Reversion Sell</div>
                <p className="text-slate-600">Sell when price closes above upper band + RSI &gt; 60</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Price above upper band</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">RSI &gt; 60</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Squeeze */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          🎈 Bollinger Squeeze
        </h4>
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <p className="text-slate-700">
            When bands narrow (low volatility), expect a significant price move. 
            The squeeze often precedes breakouts in Indian indices.
          </p>
        </div>
      </div>

      {/* Stop-Loss */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          🛡️ Stop-Loss Rule
        </h4>
        <div className="bg-white rounded-lg p-4 border border-red-100">
          <p className="text-slate-700 font-medium">{config.stopLossRule}</p>
          <p className="text-slate-500 text-sm mt-1">
            Exit if price closes beyond the middle band against your position
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-amber-600 text-xl">💡</span>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Research Note</h4>
            <p className="text-amber-700 text-sm">{config.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
