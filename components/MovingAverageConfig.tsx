"use client";

import { MovingAverageConfig as MAConfigType } from "@/lib/indicators";

interface Props {
  config: MAConfigType;
  onChange: (config: MAConfigType) => void;
}

export default function MovingAverageConfig({ config, onChange }: Props) {
  const updateShortTerm = (key: keyof MAConfigType["shortTerm"], value: any) => {
    onChange({
      ...config,
      shortTerm: { ...config.shortTerm, [key]: value },
    });
  };

  const updateCrossover = (key: keyof MAConfigType["crossover"], value: any) => {
    onChange({
      ...config,
      crossover: { ...config.crossover, [key]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* Short-term Momentum */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            ⚡ Short-term Momentum
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.shortTerm.enabled}
              onChange={(e) => updateShortTerm("enabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {config.shortTerm.enabled && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Period
              </label>
              <input
                type="number"
                value={config.shortTerm.period}
                onChange={(e) => updateShortTerm("period", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type
              </label>
              <select
                value={config.shortTerm.type}
                onChange={(e) => updateShortTerm("type", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="EMA">EMA (Exponential)</option>
                <option value="SMA">SMA (Simple)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Crossover System */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            🔄 Crossover System
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">58% Win Rate</span>
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.crossover.enabled}
              onChange={(e) => updateCrossover("enabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {config.crossover.enabled && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-3">Fast Line</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Period</label>
                  <input
                    type="number"
                    value={config.crossover.fastPeriod}
                    onChange={(e) => updateCrossover("fastPeriod", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Type</label>
                  <select
                    value={config.crossover.fastType}
                    onChange={(e) => updateCrossover("fastType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="EMA">EMA</option>
                    <option value="SMA">SMA</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-3">Slow Line</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Period</label>
                  <input
                    type="number"
                    value={config.crossover.slowPeriod}
                    onChange={(e) => updateCrossover("slowPeriod", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Type</label>
                  <select
                    value={config.crossover.slowType}
                    onChange={(e) => updateCrossover("slowType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="SMA">SMA</option>
                    <option value="EMA">EMA</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stop-Loss Rules */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          🛡️ Stop-Loss Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="text-sm font-medium text-green-700 mb-2">For Long Positions</div>
            <div className="text-lg font-semibold text-slate-800">{config.stopLossLong}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="text-sm font-medium text-red-700 mb-2">For Short Positions</div>
            <div className="text-lg font-semibold text-slate-800">{config.stopLossShort}</div>
          </div>
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
