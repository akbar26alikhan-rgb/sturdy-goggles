"use client";

import { VWAPConfig as VWAPConfigType } from "@/lib/indicators";

interface Props {
  config: VWAPConfigType;
  onChange: (config: VWAPConfigType) => void;
}

export default function VWAPConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof VWAPConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💹</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">VWAP (Volume Weighted Average Price)</h3>
            <p className="text-slate-500 text-sm">Average price weighted by volume - key intraday level</p>
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
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Intraday Settings
          <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Best for Day Trading</span>
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-orange-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">VWAP Type</label>
            <select
              value={config.type}
              onChange={(e) => updateConfig("type", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Intraday">Intraday (Session-based)</option>
              <option value="Session">Custom Session</option>
              <option value="Custom">Custom Period</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Resets at market open (9:15 AM IST)</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">Volume Threshold</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={config.volumeThreshold}
                onChange={(e) => updateConfig("volumeThreshold", parseFloat(e.target.value))}
                className="w-full px-4 py-3 text-xl font-bold text-orange-700 border-2 border-orange-200 rounded-lg"
              />
              <span className="text-slate-500 font-medium">×</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Multiple of 20-day average volume</p>
          </div>
        </div>
      </div>

      {/* VWAP Visualization */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">VWAP Band Structure</h4>
        <div className="relative h-48 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          {/* Upper Band (+1 Std Dev) */}
          <div className="absolute left-0 right-0 top-8 h-0 border-t-2 border-dashed border-green-500"></div>
          <div className="absolute right-2 top-5 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
            VWAP + 1σ
          </div>
          
          {/* VWAP Line */}
          <div className="absolute left-0 right-0 top-1/2 h-0 border-t-3 border-orange-500"></div>
          <div className="absolute left-2 top-1/2 -mt-3 text-xs text-orange-700 font-bold bg-orange-100 px-2 py-1 rounded">
            VWAP
          </div>
          
          {/* Lower Band (-1 Std Dev) */}
          <div className="absolute left-0 right-0 bottom-8 h-0 border-t-2 border-dashed border-red-500"></div>
          <div className="absolute right-2 bottom-5 text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
            VWAP - 1σ
          </div>
          
          {/* Volume bars */}
          <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 px-4">
            {[40, 60, 80, 120, 150, 100, 70, 90, 110, 80, 60, 40].map((h, i) => (
              <div
                key={i}
                className={`w-6 rounded-t ${h > 100 ? 'bg-orange-500' : 'bg-orange-300'}`}
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          
          {/* Price movement */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 50 100 Q 120 80, 180 90 T 300 70 T 420 85 T 540 60"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <circle cx="300" cy="70" r="5" fill="#22c55e" />
            <circle cx="420" cy="85" r="5" fill="#ef4444" />
          </svg>
          
          {/* Buy/Sell annotations */}
          <div className="absolute left-4 top-16 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
            Buy above VWAP
          </div>
          <div className="absolute left-4 bottom-20 bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
            Sell below VWAP
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-1 bg-orange-500"></div>
            <span>VWAP Line</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>High Volume</span>
          </div>
        </div>
      </div>

      {/* Signal Strategy */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ✅ Trading Signal
        </h4>
        <div className="bg-white rounded-lg p-4 border border-emerald-100">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 text-green-700 rounded-full w-12 h-12 flex items-center justify-center text-xl shrink-0">
              🚀
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-lg">Buy Signal</div>
              <p className="text-slate-600">{config.signalRule}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Price crosses VWAP</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Volume {'>'} {config.volumeThreshold}× avg</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Above +1 Std Dev</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VWAP Uses */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            📊 Benchmark
          </h4>
          <p className="text-sm text-slate-700">
            Institutions use VWAP to measure execution quality. Trading above VWAP = good performance.
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
          <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
            🎯 Support/Resistance
          </h4>
          <p className="text-sm text-slate-700">
            VWAP acts as dynamic S/R. Price often bounces off VWAP multiple times per session.
          </p>
        </div>
        <div className="bg-teal-50 rounded-xl p-5 border border-teal-200">
          <h4 className="font-bold text-teal-800 mb-3 flex items-center gap-2">
            ⚖️ Fair Value
          </h4>
          <p className="text-sm text-slate-700">
            VWAP represents the &quot;fair&quot; average price. Deviation suggests overbought/oversold.
          </p>
        </div>
      </div>

      {/* Time of Day */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          🕐 Intraday VWAP Behavior (IST)
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-24 text-right font-medium text-slate-600">9:15-9:30</div>
            <div className="flex-1 h-8 bg-orange-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-orange-800">Opening volatility - VWAP establishing</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-right font-medium text-slate-600">9:30-11:30</div>
            <div className="flex-1 h-8 bg-green-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-green-800">Best trading window - VWAP reliable</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-right font-medium text-slate-600">11:30-13:30</div>
            <div className="flex-1 h-8 bg-yellow-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-yellow-800">Lunch lull - lower volume, wider bands</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-right font-medium text-slate-600">13:30-15:30</div>
            <div className="flex-1 h-8 bg-blue-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-blue-800">Afternoon session - watch for breakouts</span>
            </div>
          </div>
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
            For longs: Exit if price closes below VWAP. For shorts: Exit if price closes above VWAP.
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
