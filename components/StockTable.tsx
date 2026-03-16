'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface StockTableProps {
  stocks: any[];
  loading: boolean;
}

export default function StockTable({ stocks, loading }: StockTableProps) {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-500 text-white';
      case 'A': return 'bg-emerald-400 text-white';
      case 'B': return 'bg-blue-400 text-white';
      case 'C': return 'bg-yellow-400 text-black';
      case 'D': return 'bg-orange-400 text-white';
      case 'F': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-700/50 text-slate-300 text-sm font-medium">
              <th className="p-4 border-b border-slate-700">Symbol</th>
              <th className="p-4 border-b border-slate-700">Price</th>
              <th className="p-4 border-b border-slate-700 text-right">Change</th>
              <th className="p-4 border-b border-slate-700 text-right">Volume</th>
              <th className="p-4 border-b border-slate-700 text-center">Score</th>
              <th className="p-4 border-b border-slate-700 text-center">Grade</th>
              <th className="p-4 border-b border-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-100">{stock.symbol}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">{stock.name}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-slate-200">
                  {formatCurrency(stock.currentPrice)}
                </td>
                <td className={cn(
                  "p-4 text-right font-medium",
                  stock.dayChangePercent >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  <div className="flex items-center justify-end gap-1">
                    {stock.dayChangePercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(stock.dayChangePercent).toFixed(2)}%
                  </div>
                </td>
                <td className="p-4 text-right text-slate-300">
                  {formatNumber(stock.volume)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          stock.totalScore >= 80 ? "bg-emerald-500" : stock.totalScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${stock.totalScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{stock.totalScore}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-bold",
                    getGradeColor(stock.tradeGrade)
                  )}>
                    {stock.tradeGrade}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/stock-scanner/${stock.symbol}`}
                    className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-600 text-slate-300 transition-colors"
                  >
                    <MoreHorizontal size={20} />
                  </Link>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No stocks found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
