"use client";

import { ParabolicSARConfig as SARConfigType } from "@/lib/indicators";

interface Props {
  config: SARConfigType;
  onChange: (config: SARConfigType) => void;
}

export default function ParabolicSARConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof SARConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Parabolic SAR</h3>
            <p className="text-slate-500 text-sm">Trend following with trailing stop-loss dots</p>
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
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Aggressive Settings
          <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">For Small-Caps</span>
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-pink-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">AF Step (Acceleration Factor)</label>
            <input
              type="number"
              step="0.01"
              value={config.step}
              onChange={(e) => updateConfig("step", parseFloat(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-pink-700 border-2 border-pink-200 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-2">
              How fast SAR accelerates toward price. Higher = more sensitive.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-pink-100">
            <label className="block text-sm font-medium text-slate-600 mb-2">AF Maximum</label>
            <input
              type="number"
              step="0.05"
              value={config.maximum}
              onChange={(e) => updateConfig("maximum", parseFloat(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold text-center text-rose-700 border-2 border-rose-200 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-2">
              Maximum acceleration factor cap. Prevents SAR from getting too close.
            </p>
          </div>
        </div>
      </div>

      {/* SAR Visualization */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">Parabolic SAR Behavior</h4>
        <div className="relative h-56 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden p-4">
          {/* Uptrend dots */}
          <div className="absolute left-8 top-32 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={`up-${i}`}
                className="w-3 h-3 rounded-full bg-green-500"
                style={{ marginLeft: `${i * 8}px` }}
              ></div>
            ))}
          </div>
          
          {/* Downtrend dots */}
          <div className="absolute right-8 top-16 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={`down-${i}`}
                className="w-3 h-3 rounded-full bg-red-500"
                style={{ marginRight: `${i * 8}px` }}
              ></div>
            ))}
          </div>
          
          {/* Price trend line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Uptrend */}
            <path
              d="M 50 120 L 150 100 L 200 80"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
            />
            {/* Reversal point */}
            <circle cx="200" cy="80" r="6" fill="#f59e0b" />
            {/* Downtrend */}
            <path
              d="M 200 80 L 300 100 L 400 130"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />
          </svg>
          
          {/* Labels */}
          <div className="absolute left-4 bottom-4 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
            Dots below = Uptrend
          </div>
          <div className="absolute right-4 top-4 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
            Dots above = Downtrend
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-100 text-amber-700 px-3 py-1 rounded text-sm font-bold">
            Flip = Reversal Signal
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-600">Bullish SAR (below price)</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-slate-600">Bearish SAR (above price)</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-slate-600">SAR Flip (reversal)</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          🧮 How Parabolic SAR Works
        </h4>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-semibold text-slate-800 mb-2">1. Starting Point</div>
            <p className="text-slate-600 text-sm">
              SAR starts at the extreme point (highest high or lowest low) of the previous trend.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-semibold text-slate-800 mb-2">2. Acceleration Factor (AF)</div>
            <p className="text-slate-600 text-sm">
              AF starts at {config.step} and increases by {config.step} each period, maxing at {config.maximum}. 
              Higher AF = SAR moves faster toward price.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-semibold text-slate-800 mb-2">3. Flip Condition</div>
            <p className="text-slate-600 text-sm">
              SAR flips when price touches/crosses the SAR dot. This generates a reversal signal.
            </p>
          </div>
        </div>
      </div>

      {/* Signals */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            🟢 Bullish Signals
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              SAR dots appear BELOW price candles
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              Flip from above to below = Buy signal
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              Dots act as trailing stop-loss level
            </li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            🔴 Bearish Signals
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              SAR dots appear ABOVE price candles
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Flip from below to above = Sell signal
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Dots act as trailing stop-loss level
            </li>
          </ul>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          💡 Best Practices for Indian Markets
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="font-semibold text-amber-800 mb-2">✓ Use With Trend</div>
            <p className="text-slate-600 text-sm">
              Combine SAR with ADX. Only trade SAR signals when ADX {'>'} 25 (trending market).
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="font-semibold text-amber-800 mb-2">✓ Avoid Chop</div>
            <p className="text-slate-600 text-sm">
              SAR generates many false signals in sideways markets. Use range-bound filters.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="font-semibold text-amber-800 mb-2">✓ Small-Cap Focus</div>
            <p className="text-slate-600 text-sm">
              These aggressive settings ({config.step}/{config.maximum}) work best for volatile Indian small-caps.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="font-semibold text-amber-800 mb-2">✓ Trailing Stop</div>
            <p className="text-slate-600 text-sm">
              SAR is best used as a trailing stop mechanism rather than entry signal alone.
            </p>
          </div>
        </div>
      </div>

      {/* Stop-Loss */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          🛡️ Stop-Loss Rule
        </h4>
        <div className="bg-white rounded-lg p-4 border border-red-100">
          <p className="text-slate-700 font-medium text-lg">{config.stopLossRule}</p>
          <p className="text-slate-500 text-sm mt-2">
            The SAR dot itself serves as a dynamic trailing stop. Move your stop to each new SAR dot as it appears.
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
