'use client';

import { useState, useEffect } from 'react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  score: number;
  grade: string;
}

export default function StockScanner() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/stocks/top?limit=50')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStocks(d.data.stocks.map((s: any) => ({
            symbol: s.symbol,
            name: s.name,
            price: s.currentPrice,
            change: s.dayChangePercent,
            volume: s.volume,
            score: s.totalScore,
            grade: s.tradeGrade,
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = stocks.filter(s => 
    s.symbol.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.score - a.score);

  const gradeColor = (g: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-green-500', 'A': 'bg-green-400', 'B': 'bg-blue-400',
      'C': 'bg-yellow-400', 'D': 'bg-orange-400', 'F': 'bg-red-400',
    };
    return colors[g] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">Indian Stock Profit Scanner</h1>
            <p className="text-slate-400">NSE/BSE Live Market Analysis</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-emerald-600 rounded-lg">Refresh</button>
        </div>

        <input
          type="text" placeholder="Search stocks..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 mb-6 bg-slate-800 border border-slate-700 rounded-lg"
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700 text-slate-300">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Change %</th>
                  <th className="p-3 text-right">Volume</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.symbol} className="border-t border-slate-700 hover:bg-slate-700/50">
                    <td className="p-3 text-slate-500">{i + 1}</td>
                    <td className="p-3">
                      <div className="font-semibold">{s.symbol}</div>
                      <div className="text-sm text-slate-400">{s.name}</div>
                    </td>
                    <td className="p-3 text-right">₹{s.price?.toLocaleString() || 'N/A'}</td>
                    <td className={`p-3 text-right ${s.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change?.toFixed(2) || '0.00'}%
                    </td>
                    <td className="p-3 text-right">{((s.volume || 0) / 100000).toFixed(1)}L</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-600 rounded-full h-2">
                          <div className={`h-2 rounded-full ${s.score >= 80 ? 'bg-emerald-500' : s.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${s.score}%` }} />
                        </div>
                        <span>{s.score}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${gradeColor(s.grade)} text-white`}>{s.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
