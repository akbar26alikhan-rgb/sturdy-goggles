"use client";

export default function StopLossFramework() {
  const frameworks = [
    {
      id: "volatility",
      name: "Volatility-Based SL",
      icon: "📊",
      color: "blue",
      description: "Uses Average True Range (ATR) to set dynamic stop-loss based on market volatility",
      formula: "Entry Price - (1.5 × ATR(14))",
      example: "If ATR(14) = 15 points and Entry = 18,000, SL = 17,977.5",
      pros: ["Adapts to volatility", "Wider stops in volatile markets", "Tighter stops in calm markets"],
      cons: ["Can be wide in high volatility", "Requires ATR calculation"],
      bestFor: "Swing trades, volatile Indian stocks",
    },
    {
      id: "support",
      name: "Support/Resistance SL",
      icon: "🎯",
      color: "green",
      description: "Places stop-loss below key technical levels like pivot points, Fibonacci, or recent swings",
      formula: "Below nearest support level or recent swing low",
      example: "If support at 17,950 and Entry = 18,000, SL = 17,940 (10 points buffer)",
      pros: ["Based on market structure", "Logical exit points", "Widely used by institutions"],
      cons: ["Levels can be obvious", "May get hunted by smart money"],
      bestFor: "All timeframes, breakout trades",
    },
    {
      id: "hybrid",
      name: "Hybrid SL (Recommended)",
      icon: "⚖️",
      color: "purple",
      description: "Combines indicator-based SL with maximum capital loss limit",
      formula: "Min(Indicator SL, 2% of Capital)",
      example: "If indicator SL = -3% but max loss = 2%, exit at 2% loss",
      pros: ["Best of both worlds", "Hard capital protection", "Flexible yet disciplined"],
      cons: ["Requires monitoring both", "Slightly complex"],
      bestFor: "All traders - recommended default",
    },
  ];

  const atrTable = [
    { multiplier: "1.0×", use: "Tight SL", risk: "High", type: "Scalping" },
    { multiplier: "1.5×", use: "Standard SL", risk: "Medium", type: "Swing Trading" },
    { multiplier: "2.0×", use: "Wide SL", risk: "Lower", type: "Position Trading" },
    { multiplier: "2.5×", use: "Very Wide", risk: "Low", type: "Long-term" },
  ];

  const slTips = [
    { icon: "🚫", title: "Never Move SL Wider", desc: "Once set, only move SL in favor of trade (trailing)" },
    { icon: "📉", title: "Respect the Stop", desc: "A triggered SL means your analysis was wrong - accept it" },
    { icon: "🎯", title: "Risk:Reward 1:2+", desc: "Minimum 1:2 risk-reward for every trade" },
    { icon: "💰", title: "Position Sizing", desc: "Risk max 1-2% of capital per trade" },
    { icon: "📊", title: "ATR Check", desc: "Always check ATR before entering - avoid low ATR periods" },
    { icon: "⏰", title: "Time-Based SL", desc: "Exit if trade doesn&apos;t move in 3-5 candles" },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; light: string }> = {
      blue: { bg: "from-blue-500 to-blue-600", border: "border-blue-200", text: "text-blue-800", light: "bg-blue-50" },
      green: { bg: "from-green-500 to-green-600", border: "border-green-200", text: "text-green-800", light: "bg-green-50" },
      purple: { bg: "from-purple-500 to-purple-600", border: "border-purple-200", text: "text-purple-800", light: "bg-purple-50" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          🛡️ Stop-Loss Framework
        </h2>
        <p className="text-white/90 mt-2">
          Protect your capital with disciplined risk management - the key to long-term trading success
        </p>
      </div>

      {/* Framework Cards */}
      <div className="space-y-4">
        {frameworks.map((fw) => {
          const colors = getColorClasses(fw.color);
          return (
            <div key={fw.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${colors.border}`}>
              <div className={`bg-gradient-to-r ${colors.bg} px-6 py-4 text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{fw.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{fw.name}</h3>
                    {fw.id === "hybrid" && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Recommended</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">{fw.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className={`${colors.light} rounded-lg p-4`}>
                    <div className={`text-sm font-semibold ${colors.text} mb-1`}>Formula</div>
                    <div className="text-slate-700 font-mono text-sm">{fw.formula}</div>
                  </div>
                  <div className={`${colors.light} rounded-lg p-4`}>
                    <div className={`text-sm font-semibold ${colors.text} mb-1`}>Example</div>
                    <div className="text-slate-700 text-sm">{fw.example}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-green-700 mb-2">✓ Pros</div>
                    <ul className="space-y-1">
                      {fw.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-green-500">•</span>{pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-red-700 mb-2">✗ Cons</div>
                    <ul className="space-y-1">
                      {fw.cons.map((con, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-red-500">•</span>{con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-slate-500">Best for: </span>
                  <span className="text-sm text-slate-700">{fw.bestFor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ATR Multiplier Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📊 ATR Multiplier Guide
          </h3>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Multiplier</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Use Case</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Stop Risk</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Trade Type</th>
              </tr>
            </thead>
            <tbody>
              {atrTable.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800">{row.multiplier}</td>
                  <td className="py-3 px-4 text-slate-600">{row.use}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.risk === "High" ? "bg-red-100 text-red-700" :
                      row.risk === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Golden Rules */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
        <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
          👑 Stop-Loss Golden Rules
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slTips.map((tip, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
              <div className="text-2xl mb-2">{tip.icon}</div>
              <div className="font-semibold text-slate-800 mb-1">{tip.title}</div>
              <div className="text-sm text-slate-600">{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Position Sizing Calculator */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
        <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
          🧮 Position Sizing Formula
        </h3>
        <div className="bg-white rounded-xl p-6 border border-emerald-100">
          <div className="text-center">
            <div className="text-lg font-mono text-slate-700 mb-4">
              Position Size = (Account Risk ₹) ÷ (Entry - Stop Loss)
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-emerald-700 mb-2">Example Account</div>
                <div className="text-slate-600 text-sm">Capital: ₹10,00,000</div>
                <div className="text-slate-600 text-sm">Risk per trade: 1% = ₹10,000</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-emerald-700 mb-2">Trade Setup</div>
                <div className="text-slate-600 text-sm">Entry: ₹500</div>
                <div className="text-slate-600 text-sm">Stop Loss: ₹490</div>
                <div className="text-slate-600 text-sm">Risk: ₹10 per share</div>
              </div>
              <div className="bg-emerald-100 rounded-lg p-4">
                <div className="text-sm font-semibold text-emerald-700 mb-2">Position Size</div>
                <div className="text-2xl font-bold text-emerald-800">1,000 shares</div>
                <div className="text-slate-600 text-sm">Total: ₹5,00,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Risk Warning</h3>
            <p className="text-red-700">
              Trading in Indian stock markets involves significant risk. These stop-loss settings are based on 
              historical data and backtests but do not guarantee future results. Always:
            </p>
            <ul className="mt-3 space-y-2 text-red-700">
              <li className="flex items-start gap-2">
                <span>•</span> Start with paper trading to test strategies
              </li>
              <li className="flex items-start gap-2">
                <span>•</span> Never risk more than you can afford to lose
              </li>
              <li className="flex items-start gap-2">
                <span>•</span> Consult a SEBI-registered advisor before trading
              </li>
              <li className="flex items-start gap-2">
                <span>•</span> Keep emotions out of trading decisions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
