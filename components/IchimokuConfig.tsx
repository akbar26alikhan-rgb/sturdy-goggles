"use client";

import { IchimokuConfig as IchimokuConfigType } from "@/lib/indicators";

interface Props {
  config: IchimokuConfigType;
  onChange: (config: IchimokuConfigType) => void;
}

export default function IchimokuConfig({ config, onChange }: Props) {
  const updateConfig = (key: keyof IchimokuConfigType, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☁️</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Ichimoku Cloud</h3>
            <p className="text-slate-500 text-sm">All-in-one trend indicator with support/resistance</p>
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
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚙️ Standard Settings
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-sky-100 text-center">
            <div className="text-3xl font-bold text-sky-700">{config.tenkan}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">Tenkan-Sen</div>
            <div className="text-xs text-slate-400">Conversion Line</div>
            <div className="text-xs text-slate-500 mt-1">(Highest High + Lowest Low) / 2</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100 text-center">
            <div className="text-3xl font-bold text-blue-700">{config.kijun}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">Kijun-Sen</div>
            <div className="text-xs text-slate-400">Base Line</div>
            <div className="text-xs text-slate-500 mt-1">Major support/resistance</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-100 text-center">
            <div className="text-3xl font-bold text-indigo-700">{config.senkou}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">Senkou Span</div>
            <div className="text-xs text-slate-400">Leading Span B</div>
            <div className="text-xs text-slate-500 mt-1">Cloud boundary</div>
          </div>
        </div>
      </div>

      {/* Cloud Visualization */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-slate-800 mb-4">Ichimoku Cloud Structure</h4>
        <div className="relative h-56 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          {/* Cloud (Kumo) */}
          <div className="absolute left-20 right-20 top-16 bottom-16 bg-gradient-to-b from-green-200/50 to-green-100/30 border border-green-300 rounded">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-green-700 font-bold text-lg">KUMO (Cloud)</span>
            </div>
          </div>
          
          {/* Senkou Span A (Leading) */}
          <div className="absolute left-0 right-0 top-16 h-0 border-t-2 border-dashed border-green-600"></div>
          <div className="absolute left-2 top-12 text-xs text-green-700 font-semibold">Senkou A (Leading)</div>
          
          {/* Senkou Span B (Leading) */}
          <div className="absolute left-0 right-0 bottom-16 h-0 border-t-2 border-dashed border-green-800"></div>
          <div className="absolute left-2 bottom-12 text-xs text-green-800 font-semibold">Senkou B (Leading)</div>
          
          {/* Tenkan-Sen */}
          <div className="absolute left-0 right-0 top-28 h-0 border-t-2 border-red-500"></div>
          <div className="absolute right-2 top-24 text-xs text-red-600 font-semibold">Tenkan ({config.tenkan})</div>
          
          {/* Kijun-Sen */}
          <div className="absolute left-0 right-0 top-36 h-0 border-t-2 border-blue-600"></div>
          <div className="absolute right-2 top-32 text-xs text-blue-700 font-semibold">Kijun ({config.kijun})</div>
          
          {/* Price */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 50 100 L 150 80 L 250 90 L 350 60 L 450 70"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
            />
          </svg>
          
          {/* Chikou Span label */}
          <div className="absolute bottom-2 right-2 text-xs text-purple-600 font-semibold">
            Chikou Span (Lagging) - {config.kijun} periods back
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-1 bg-red-500"></div>
            <span>Tenkan (Conversion)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-1 bg-blue-600"></div>
            <span>Kijun (Base)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-green-200 border border-green-400"></div>
            <span>Cloud (Kumo)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-1 bg-purple-500"></div>
            <span>Chikou (Lagging)</span>
          </div>
        </div>
      </div>

      {/* Signal Strategy */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          ✅ Confirmation Requirements
        </h4>
        <div className="bg-white rounded-lg p-4 border border-emerald-100">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">1️⃣</span>
              <div>
                <div className="font-semibold text-slate-800">Price Position</div>
                <p className="text-slate-600 text-sm">Price must be ABOVE the Cloud for bullish signals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">2️⃣</span>
              <div>
                <div className="font-semibold text-slate-800">Chikou Span</div>
                <p className="text-slate-600 text-sm">Chikou Span (26 periods ago) must be ABOVE price</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">3️⃣</span>
              <div>
                <div className="font-semibold text-slate-800">TK Cross</div>
                <p className="text-slate-600 text-sm">Tenkan crosses above Kijun for strong bullish signal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Color Signals */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            🟢 Bullish Cloud (Kumo)
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Senkou A {'>'} Senkou B (Green Cloud)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Price above cloud = Uptrend
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Cloud acts as support
            </li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            🔴 Bearish Cloud (Kumo)
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Senkou B {'>'} Senkou A (Red Cloud)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Price below cloud = Downtrend
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">✓</span>
              Cloud acts as resistance
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
            Kijun-Sen acts as dynamic support/resistance - ideal for trailing stops
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
