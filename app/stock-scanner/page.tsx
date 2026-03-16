'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Filter, TrendingUp, AlertCircle, Download } from 'lucide-react';
import StockTable from '@/components/StockTable';
import { cn } from '@/lib/utils';

export default function StockScannerPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFilters] = useState({
    minScore: 0,
    grade: 'All',
    sector: 'All'
  });

  const fetchData = useCallback(async (refresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/top?limit=50${refresh ? '&refresh=true' : ''}`);
      const result = await res.json();
      if (result.success) {
        setStocks(result.data.stocks);
        setLastUpdated(new Date(result.data.lastUpdate));
      }
    } catch (error) {
      console.error("Failed to fetch stocks", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Auto refresh every 5 minutes
    const interval = setInterval(() => fetchData(), 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(search.toLowerCase()) || 
                          stock.name.toLowerCase().includes(search.toLowerCase());
    const matchesScore = stock.totalScore >= filters.minScore;
    const matchesGrade = filters.grade === 'All' || stock.tradeGrade === filters.grade;
    
    return matchesSearch && matchesScore && matchesGrade;
  }).sort((a, b) => b.totalScore - a.totalScore);

  const exportToCSV = () => {
    const headers = ["Symbol", "Name", "Price", "Change%", "Score", "Grade"];
    const rows = filteredStocks.map(s => [s.symbol, s.name, s.currentPrice, s.dayChangePercent, s.totalScore, s.tradeGrade]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "top_stocks.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Indian Stock Profit Scanner</h1>
              <p className="text-xs text-slate-400">Live NSE Market Analysis & Scoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block mr-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Last Sync</p>
              <p className="text-xs text-slate-300 font-mono">{lastUpdated?.toLocaleTimeString() || 'Never'}</p>
            </div>
            <button 
              onClick={() => fetchData(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700"
              disabled={loading}
            >
              <RefreshCw size={16} className={cn(loading && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium mb-1">Total Scanned</p>
            <h3 className="text-3xl font-bold">{stocks.length}</h3>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} />
              Updated every 5 mins
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium mb-1">A+ Opportunities</p>
            <h3 className="text-3xl font-bold text-emerald-400">
              {stocks.filter(s => s.tradeGrade === 'A+').length}
            </h3>
            <p className="text-xs text-slate-500 mt-2">Score above 90/100</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium mb-1">Market Sentiment</p>
            <h3 className="text-3xl font-bold text-blue-400">Neutral</h3>
            <p className="text-xs text-slate-500 mt-2">Based on Nifty 50 Trend</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by symbol or name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              value={filters.grade}
              onChange={(e) => setFilters({...filters, grade: e.target.value})}
            >
              <option value="All">All Grades</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
              <option value="D">Grade D</option>
              <option value="F">Grade F</option>
            </select>
            <select 
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              value={filters.minScore}
              onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value)})}
            >
              <option value="0">Min Score: 0</option>
              <option value="50">Min Score: 50</option>
              <option value="70">Min Score: 70</option>
              <option value="80">Min Score: 80</option>
              <option value="90">Min Score: 90</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <StockTable stocks={filteredStocks} loading={loading} />
        
        {/* Footer Info */}
        <div className="mt-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
          <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Filter size={16} />
            How it works
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-slate-400">
            <div>
              <p className="font-bold text-slate-300 uppercase mb-1">Trend Strength</p>
              <p>Analyzes price relative to 50 & 200 DMA. Rewards stocks in confirmed uptrends.</p>
            </div>
            <div>
              <p className="font-bold text-slate-300 uppercase mb-1">Volume Spike</p>
              <p>Compares current volume to 20-day average. High volume confirms price moves.</p>
            </div>
            <div>
              <p className="font-bold text-slate-300 uppercase mb-1">Growth & Fundamentals</p>
              <p>Scores based on EPS growth, revenue growth and debt-to-equity ratios.</p>
            </div>
            <div>
              <p className="font-bold text-slate-300 uppercase mb-1">Valuation</p>
              <p>Compares PE ratio against sector averages to find undervalued gems.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
