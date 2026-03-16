'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, TrendingUp, BarChart3, PieChart, 
  Activity, ShieldCheck, Gauge, Info, AlertTriangle 
} from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, BarChart, Bar 
} from 'recharts';

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/stocks/${symbol}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load stock data");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Error Loading Stock</h1>
        <p className="text-slate-400 mb-6">{error || "Stock not found"}</p>
        <Link href="/stock-scanner" className="text-emerald-500 flex items-center gap-2 hover:underline">
          <ArrowLeft size={20} /> Back to Scanner
        </Link>
      </div>
    );
  }

  const { scores } = data;

  const scoreItems = [
    { label: 'Trend Strength', value: scores.trend, max: 20, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Volume/Liquidity', value: scores.volume, max: 15, icon: Activity, color: 'text-purple-400' },
    { label: 'Breakout Potential', value: scores.breakout, max: 15, icon: BarChart3, color: 'text-orange-400' },
    { label: 'Fundamental Growth', value: scores.growth, max: 20, icon: PieChart, color: 'text-emerald-400' },
    { label: 'Financial Strength', value: scores.financial, max: 10, icon: ShieldCheck, color: 'text-cyan-400' },
    { label: 'Valuation', value: scores.valuation, max: 10, icon: Gauge, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <Link href="/stock-scanner" className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Scanner
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black tracking-tight">{data.symbol}</h1>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-bold",
                  scores.total >= 80 ? "bg-emerald-500/20 text-emerald-400" : scores.total >= 60 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                )}>
                  Grade {scores.grade}
                </span>
              </div>
              <h2 className="text-xl text-slate-400 font-medium">{data.name}</h2>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-mono font-bold mb-1">
                {formatCurrency(data.price)}
              </div>
              <div className={cn(
                "font-bold flex items-center justify-end gap-1",
                data.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
              )}>
                {data.changePercent >= 0 ? '+' : ''}{data.change?.toFixed(2)} ({data.changePercent?.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {/* TradingView Widget Placeholder / Real Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[500px] relative">
              <div className="absolute inset-0 p-6 flex flex-col">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-emerald-500" />
                  Price Action (30 Days)
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{fill: '#64748b', fontSize: 10}} 
                      tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}
                      axisLine={false}
                    />
                    <YAxis 
                      hide={true} 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px'}}
                      labelFormatter={(val) => new Date(val).toLocaleDateString('en-IN', {dateStyle: 'medium'})}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score Breakdown Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <PieChart size={20} className="text-emerald-500" />
                  Detailed Score Breakdown
                </h3>
                <div className="space-y-6">
                  {scoreItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <item.icon size={16} className={item.color} />
                          <span className="text-sm text-slate-300 font-medium">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold">{item.value}/{item.max}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", item.color.replace('text', 'bg'))}
                          style={{ width: `${(item.value / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Info size={20} className="text-emerald-500" />
                  Key Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Market Cap</p>
                    <p className="text-sm font-bold">{formatNumber(data.marketCap)}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">P/E Ratio</p>
                    <p className="text-sm font-bold">{data.peRatio?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">52W High</p>
                    <p className="text-sm font-bold text-emerald-400">{formatCurrency(data.high52)}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">52W Low</p>
                    <p className="text-sm font-bold text-red-400">{formatCurrency(data.low52)}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Avg Volume</p>
                    <p className="text-sm font-bold">{formatNumber(data.volume)}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Trend</p>
                    <p className="text-sm font-bold">{scores.trend >= 15 ? 'Strong Bullish' : scores.trend >= 10 ? 'Bullish' : 'Neutral'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            {/* Total Score Gauge */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">Overall Profit Potential</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={552.9}
                    strokeDashoffset={552.9 - (552.9 * scores.total) / 100}
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-1000",
                      scores.total >= 80 ? "text-emerald-500" : scores.total >= 60 ? "text-yellow-500" : "text-red-500"
                    )}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black">{scores.total}</span>
                  <span className="text-xs text-slate-500 font-bold uppercase">Points</span>
                </div>
              </div>
              <div className="mt-6">
                <div className={cn(
                  "inline-block px-6 py-2 rounded-xl text-lg font-black tracking-tighter",
                  scores.total >= 80 ? "bg-emerald-500 text-slate-950" : scores.total >= 60 ? "bg-yellow-500 text-slate-950" : "bg-red-500 text-white"
                )}>
                  {scores.grade === 'A+' ? 'STRONG BUY' : 
                   scores.grade === 'A' ? 'GOOD TRADE' : 
                   scores.grade === 'B' ? 'DECENT' : 
                   scores.grade === 'C' ? 'RISKY' : 
                   scores.grade === 'D' ? 'AVOID' : 'NO TRADE'}
                </div>
              </div>
            </div>

            {/* Business Summary */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-emerald-500" />
                Company Profile
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-6">
                {data.details?.summary || "No company description available."}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Sector</span>
                  <span className="text-xs font-bold text-slate-300">{data.details?.sector || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Industry</span>
                  <span className="text-xs font-bold text-slate-300">{data.details?.industry || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
