"use client";

import { FibonacciConfig as FibConfigType } from "@/lib/indicators";

interface Props {
  config: FibConfigType;
  onChange: (config: FibConfigType) => void;
}

export default function FibonacciConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof FibConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const toggleLevel = (level: string) => {
    const newLevels = config.primaryLevels.includes(level)
      ? config.primaryLevels.filter((l) => l !== level)
      : [...config.primaryLevels, level];
    updateConfig("primaryLevels", newLevels);
  };

  const allLevels = ["23.6%", "38.2%", "50%", "61.8%", "78.6%"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔢</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Fibonacci Retracement</h3>
            <p className="text-slate-500 text-sm">Support/resistance based on golden ratio</p>
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

      {/* Primary Levels */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          🎯 Primary Trading Levels
          <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">Key for Indian Markets</span>
        </h4>
        <div className="grid grid-cols-5 gap-3">
          {allLevels.map((level) => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={`p-3 rounded-lg border-2 transition-all ${
                config.primaryLevels.includes(level)
                  ? "bg-amber-500 text-white border-amber-500 shadow-lg"
                  : "bg-white text-slate-600 border-gray-200 hover:border-amber-300"
              }`}
            >
              <div className="text-lg font-bold">{level}</div>
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-3">
          Click to select/deselect levels. {config.primaryLevels.join(" & ")} are most significant for pullbacks.
        </p>
      </div>

      {/* Fibonacci Visualization */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">Fibonacci Retracement Zones</h4>
        <div className="relative h-64 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden p-4">
          {/* Swing High */}
          <div className="absolute left-4 top-4 right-4 flex items-center gap-2">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">Swing High</div>
            <div className="flex-1 h-0 border-t-2 border-green-300"></div>
          </div>
          
          {/* 23.6% */}
          <div className="absolute left-4 top-16 right-4 flex items-center gap-2">
            <div className="text-xs text-slate-500 w-12">23.6%</div>
            <div className="flex-1 h-px bg-slate-300"></div>
            <div className="text-xs text-slate-400">Shallow pullback</div>
          </div>
          
          {/* 38.2% - Key Level */}
          <div className="absolute left-4 top-24 right-4 flex items-center gap-2">
            <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold w-12 text-center">38.2%</div>
            <div className="flex-1 h-0 border-t-2 border-amber-400"></div>
            <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">Shallow pullback - Strong trend</div>
          </div>
          
          {/* 50% */}
          <div className="absolute left-4 top-32 right-4 flex items-center gap-2">
            <div className="text-xs text-slate-500 w-12 text-center">50%</div>
            <div className="flex-1 h-px bg-slate-300"></div>
            <div className="text-xs text-slate-400">Psychological level</div>
          </div>
          
          {/* 61.8% - Key Level */}
          <div className="absolute left-4 top-40 right-4 flex items-center gap-2">
            <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold w-12 text-center">61.8%</div>
            <div className="flex-1 h-0 border-t-2 border-orange-400"></div>
            <div className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">Deep pullback - Golden ratio</div>
          </div>
          
          {/* 78.6% */}
          <div className="absolute left-4 top-48 right-4 flex items-center gap-2">
            <div className="text-xs text-slate-500 w-12 text-center">78.6%</div>
            <div className="flex-1 h-px bg-slate-300"></div>
            <div className="text-xs text-slate-400">Last chance</div>
          </div>
          
          {/* Swing Low */}
          <div className="absolute left-4 bottom-4 right-4 flex items-center gap-2">
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold">Swing Low</div>
            <div className="flex-1 h-0 border-t-2 border-red-300"></div>
          </div>
          
          {/* Price action */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 100 30 L 200 30 L 250 80 L 300 55 L 350 110 L 400 90"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <circle cx="300" cy="55" r="5" fill="#f59e0b" />
            <circle cx="350" cy="110" r="5" fill="#ea580c" />
          </svg>
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ✅ Confirmation Rule
        </h4>
        <div className="bg-white rounded-lg p-4 border border-emerald-100">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 text-green-700 rounded-full w-12 h-12 flex items-center justify-center text-xl shrink-0">
              📊
            </div>
            <div>
              <p className="text-slate-700 font-medium">{config.confirmationRule}</p>
              <p className="text-slate-500 text-sm mt-2">
                RSI confirmation at 61.8% level significantly increases win rate in Indian markets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Guide */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
          <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
            📉 38.2% Level
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span>
              Shallow pullback in strong trend
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span>
              Best for trending markets
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span>
              Quick reversals expected
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span>
              Tight stop-loss recommended
            </li>
          </ul>
        </div>
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
          <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
            📉 61.8% Level
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">•</span>
              Deep pullback - Golden Ratio
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">•</span>
              Strong support/resistance
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">•</span>
              Often final pullback level
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">•</span>
              Higher probability trade
            </li>
          </ul>
        </div>
      </div>

      {/* Extensions */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          📈 Fibonacci Extensions (Profit Targets)
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {["138.2%", "161.8%", "200%", "261.8%"].map((ext) => (
            <div key={ext} className="bg-white rounded-lg p-3 text-center border border-purple-100">
              <div className="text-lg font-bold text-purple-700">{ext}</div>
              <div className="text-xs text-slate-500">Target</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 mt-3">
          Use extensions for setting profit targets after price bounces off retracement levels.
        </p>
      </div>

      {/* Stop-Loss */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          🛡️ Stop-Loss Rule
        </h4>
        <div className="bg-white rounded-lg p-4 border border-red-100">
          <p className="text-slate-700 font-medium">{config.stopLossRule}</p>
          <p className="text-slate-500 text-sm mt-1">
            If price breaks below (for longs) or above (for shorts) the Fib level by 1%, trend may be reversing.
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
