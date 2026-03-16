"use client";

import { StochasticConfig as StochConfigType } from "@/lib/indicators";

interface Props {
  config: StochConfigType;
  onChange: (config: StochConfigType) => void;
}

export default function StochasticConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof StochConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔄</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Stochastic Oscillator</h3>
            <p className="text-slate-500 text-sm">Momentum indicator comparing closing price to price range</p>
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
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Optimized Settings
          <span className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">TV Community</span>
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-teal-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">%K Period</label>
            <input
              type="number"
              value={config.kPeriod}
              onChange={(e) => updateConfig("kPeriod", parseInt(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-teal-700 border-2 border-teal-200 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">Fast line period</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-teal-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">%D Period</label>
            <input
              type="number"
              value={config.dPeriod}
              onChange={(e) => updateConfig("dPeriod", parseInt(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-cyan-700 border-2 border-cyan-200 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">Slow line period</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-teal-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">Smoothing</label>
            <input
              type="number"
              value={config.smoothing}
              onChange={(e) => updateConfig("smoothing", parseInt(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-blue-700 border-2 border-blue-200 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">%K smoothing</p>
          </div>
        </div>
      </div>

      {/* Zones */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">Stochastic Zones (0-100)</h4>
        <div className="relative h-16 rounded-full overflow-hidden flex">
          <div className="bg-green-500 flex items-center justify-center text-white font-bold text-sm" style={{ width: "25%" }}>
            <div className="text-center">
              <div>Oversold</div>
              <div className="text-xs opacity-80">0-25</div>
            </div>
          </div>
          <div className="bg-gray-300 flex items-center justify-center text-slate-700 font-medium text-sm" style={{ width: "50%" }}>
            <div className="text-center">
              <div>Neutral</div>
              <div className="text-xs opacity-80">25-75</div>
            </div>
          </div>
          <div className="bg-red-500 flex items-center justify-center text-white font-bold text-sm" style={{ width: "25%" }}>
            <div className="text-center">
              <div>Overbought</div>
              <div className="text-xs opacity-80">75-100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Strategy */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          📈 Trading Signals
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">B</div>
              <div className="font-semibold text-slate-800">Buy Signal</div>
            </div>
            <p className="text-slate-600 text-sm">{config.signalRule}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">%K crosses %D</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Below 25</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">S</div>
              <div className="font-semibold text-slate-800">Sell Signal</div>
            </div>
            <p className="text-slate-600 text-sm">Sell when %K crosses %D above 75</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">%K crosses %D</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Above 75</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divergence */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          🔔 Divergence Patterns
        </h4>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="font-medium text-green-700">Bullish Divergence</div>
            <p className="text-slate-600 text-sm">Price makes lower low, Stochastic makes higher low → Buy signal</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="font-medium text-red-700">Bearish Divergence</div>
            <p className="text-slate-600 text-sm">Price makes higher high, Stochastic makes lower high → Sell signal</p>
          </div>
        </div>
      </div>

      {/* Stop-Loss */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          🛡️ Stop-Loss Rule
        </h4>
        <div className="bg-white rounded-lg p-4 border border-red-100">
          <p className="text-slate-700">{config.stopLossRule}</p>
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
