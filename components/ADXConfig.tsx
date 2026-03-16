"use client";

import { ADXConfig as ADXConfigType } from "@/lib/indicators";

interface Props {
  config: ADXConfigType;
  onChange: (config: ADXConfigType) => void;
}

export default function ADXConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof ADXConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📐</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">ADX (Average Directional Index)</h3>
            <p className="text-slate-500 text-sm">Trend strength measurement (not direction)</p>
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
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Settings
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <div className="text-3xl font-bold text-violet-700">{config.period}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">ADX Period</div>
            <div className="text-xs text-slate-400">Standard setting</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100 text-center">
            <div className="text-3xl font-bold text-green-700">{config.trendThreshold}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">Strong Trend</div>
            <div className="text-xs text-slate-400">ADX above = Trend strong</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-100 text-center">
            <div className="text-3xl font-bold text-red-700">{config.weakTrendThreshold}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">Weak Trend</div>
            <div className="text-xs text-slate-400">ADX below = No trend</div>
          </div>
        </div>
      </div>

      {/* ADX Zones */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">ADX Trend Strength Scale (0-100)</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 text-right font-bold text-slate-400">0-20</div>
            <div className="flex-1 h-8 bg-gray-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-slate-600">Weak / No Trend</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 text-right font-bold text-yellow-600">20-25</div>
            <div className="flex-1 h-8 bg-yellow-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-yellow-800">Transition Zone</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 text-right font-bold text-green-600">25-50</div>
            <div className="flex-1 h-8 bg-green-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-green-800">Strong Trend ✓ TRADE HERE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 text-right font-bold text-blue-600">50-75</div>
            <div className="flex-1 h-8 bg-blue-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-blue-800">Very Strong Trend</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 text-right font-bold text-purple-600">75-100</div>
            <div className="flex-1 h-8 bg-purple-200 rounded flex items-center px-3">
              <span className="text-sm font-medium text-purple-800">Extremely Strong (Rare)</span>
            </div>
          </div>
        </div>
      </div>

      {/* DI+ and DI- */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          📊 Directional Indicators
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">+DI</div>
              <div>
                <div className="font-semibold text-slate-800">Positive DI</div>
                <div className="text-xs text-slate-500">Bullish pressure</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Measures upward price movement strength. When +DI {'>'} -DI, bulls are in control.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">-DI</div>
              <div>
                <div className="font-semibold text-slate-800">Negative DI</div>
                <div className="text-xs text-slate-500">Bearish pressure</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Measures downward price movement strength. When -DI {'>'} +DI, bears are in control.
            </p>
          </div>
        </div>
      </div>

      {/* Signal Rules */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ✅ Entry Signal Rules
        </h4>
        <div className="bg-white rounded-lg p-4 border border-emerald-100">
          <p className="text-slate-700 font-medium mb-3">{config.signalRule}</p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>ADX must be above {config.trendThreshold} for trend confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>+DI {'>'} -DI = Bullish trend (go long)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>-DI {'>'} +DI = Bearish trend (go short)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ADX Rising/Falling */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            📈 Rising ADX
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Trend strength INCREASING
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Good time to add to position
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Hold existing trades
            </li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            📉 Falling ADX
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Trend strength DECREASING
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Consider taking profits
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Trend may be ending
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
          <p className="text-slate-700 font-medium">{config.stopLossRule}</p>
          <p className="text-slate-500 text-sm mt-1">
            ADX dropping below 20 suggests the trend is losing momentum - exit to avoid chop
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
