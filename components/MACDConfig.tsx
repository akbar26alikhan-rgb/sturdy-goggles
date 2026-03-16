"use client";

import { MACDConfig as MACDConfigType } from "@/lib/indicators";

interface Props {
  config: MACDConfigType;
  onChange: (config: MACDConfigType) => void;
}

export default function MACDConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof MACDConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📉</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">MACD (Moving Average Convergence Divergence)</h3>
            <p className="text-slate-500 text-sm">Trend-following momentum indicator</p>
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

      {/* Settings Grid */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Optimized Settings for Nifty Intraday
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">Fast EMA</label>
            <input
              type="number"
              value={config.fastEMA}
              onChange={(e) => updateConfig("fastEMA", parseInt(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-purple-700 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
            <p className="text-xs text-slate-500 mt-1 text-center">Shorter = More sensitive</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">Slow EMA</label>
            <input
              type="number"
              value={config.slowEMA}
              onChange={(e) => updateConfig("slowEMA", parseInt(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-indigo-700 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <p className="text-xs text-slate-500 mt-1 text-center">Longer = Smoother</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">Signal Line</label>
            <input
              type="number"
              value={config.signalPeriod}
              onChange={(e) => updateConfig("signalPeriod", parseInt(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-pink-700 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
            <p className="text-xs text-slate-500 mt-1 text-center">EMA of MACD</p>
          </div>
        </div>
      </div>

      {/* MACD Visualization */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">MACD Components</h4>
        <div className="relative">
          <div className="h-40 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden">
            {/* Zero Line */}
            <div className="absolute left-0 right-0 top-1/2 border-t-2 border-slate-300"></div>
            {/* MACD Line (Fast - Slow) */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 20 60 Q 80 30, 140 50 T 260 70 T 380 40"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="3"
              />
              <path
                d="M 20 65 Q 80 40, 140 55 T 260 75 T 380 50"
                fill="none"
                stroke="#db2777"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
            </svg>
            {/* Histogram bars */}
            <div className="absolute bottom-8 left-10 flex gap-1 items-end h-20">
              <div className="w-4 h-8 bg-green-400 rounded-t"></div>
              <div className="w-4 h-12 bg-green-500 rounded-t"></div>
              <div className="w-4 h-16 bg-green-600 rounded-t"></div>
              <div className="w-4 h-10 bg-red-400 rounded-t"></div>
              <div className="w-4 h-6 bg-red-500 rounded-t"></div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-purple-600"></div>
              <span className="text-sm text-slate-600">MACD Line ({config.fastEMA},{config.slowEMA})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-pink-600 border-dashed" style={{borderTop: '2px dashed #db2777'}}></div>
              <span className="text-sm text-slate-600">Signal ({config.signalPeriod})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-600">Histogram</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Rule */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ✅ Confirmation Rule
        </h4>
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-slate-700 font-medium">{config.confirmationRule}</p>
              <p className="text-slate-500 text-sm mt-1">
                This filters out false signals by ensuring momentum is building
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Conditions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            🟢 Bullish Signal
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              MACD Line crosses ABOVE Signal Line
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Histogram bars increasing (3 consecutive)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Below zero line = stronger signal
            </li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            🔴 Bearish Signal
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              MACD Line crosses BELOW Signal Line
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Histogram bars decreasing (3 consecutive)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Above zero line = stronger signal
            </li>
          </ul>
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
