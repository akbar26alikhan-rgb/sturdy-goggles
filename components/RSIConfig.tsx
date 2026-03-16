"use client";

import { RSIConfig as RSIConfigType } from "@/lib/indicators";

interface Props {
  config: RSIConfigType;
  onChange: (config: RSIConfigType) => void;
}

export default function RSIConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof RSIConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Relative Strength Index</h3>
            <p className="text-slate-500 text-sm">Momentum oscillator for overbought/oversold conditions</p>
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

      {/* Configuration */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Settings
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              RSI Period
            </label>
            <input
              type="number"
              value={config.period}
              onChange={(e) => updateConfig("period", parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
            />
            <p className="text-xs text-slate-500 mt-1">Lower = More sensitive</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Oversold Level
            </label>
            <div className="relative">
              <input
                type="number"
                value={config.oversoldThreshold}
                onChange={(e) => updateConfig("oversoldThreshold", parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold text-green-700"
              />
              <span className="absolute right-3 top-3 text-green-600 font-bold">BUY</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Overbought Level
            </label>
            <div className="relative">
              <input
                type="number"
                value={config.overboughtThreshold}
                onChange={(e) => updateConfig("overboughtThreshold", parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-semibold text-red-700"
              />
              <span className="absolute right-3 top-3 text-red-600 font-bold">SELL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Gauge */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">RSI Zone Visualization</h4>
        <div className="relative h-12 rounded-full overflow-hidden flex">
          <div 
            className="bg-green-500 flex items-center justify-center text-white font-bold text-sm"
            style={{ width: `${config.oversoldThreshold}%` }}
          >
            Oversold
          </div>
          <div 
            className="bg-gray-300 flex items-center justify-center text-slate-700 font-medium text-sm"
            style={{ width: `${config.overboughtThreshold - config.oversoldThreshold}%` }}
          >
            Neutral
          </div>
          <div 
            className="bg-red-500 flex items-center justify-center text-white font-bold text-sm"
            style={{ width: `${100 - config.overboughtThreshold}%` }}
          >
            Overbought
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-500">
          <span>0</span>
          <span className="font-semibold text-green-600">{config.oversoldThreshold}</span>
          <span className="font-semibold text-red-600">{config.overboughtThreshold}</span>
          <span>100</span>
        </div>
      </div>

      {/* Signal Strategy */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          📈 Trading Strategy
        </h4>
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-white rounded-lg p-4 border border-indigo-100">
            <div className="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">
              BUY
            </div>
            <div>
              <div className="font-semibold text-slate-800">Long Entry Signal</div>
              <div className="text-slate-600 text-sm">RSI crosses above {config.oversoldThreshold} from below</div>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white rounded-lg p-4 border border-indigo-100">
            <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">
              SELL
            </div>
            <div>
              <div className="font-semibold text-slate-800">Short Entry Signal</div>
              <div className="text-slate-600 text-sm">RSI crosses below {config.overboughtThreshold} from above</div>
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
