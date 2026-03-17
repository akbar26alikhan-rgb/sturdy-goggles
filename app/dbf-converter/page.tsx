import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Database } from 'lucide-react';
import DBFConverter from '@/components/DBFConverter';

export default function DBFConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <div className="p-1 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
              <ChevronLeft className="w-5 h-5" />
            </div>
            Back to Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                DBF Converter
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Professional tool for viewing and converting dBase files
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                  {i === 1 ? 'CSV' : i === 2 ? 'XLS' : 'PDF'}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="text-zinc-900 dark:text-white font-medium">Multiple Formats</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">Full compatibility</p>
            </div>
          </div>
        </div>

        {/* Main Component */}
        <DBFConverter />

        {/* Footer Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Private & Secure</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your files are processed entirely in your browser. No data is ever uploaded to a server.
            </p>
          </div>
          <div className="p-6 bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Large File Support</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Handle thousands of records with high-performance client-side filtering and sorting.
            </p>
          </div>
          <div className="p-6 bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Free to Use</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No registration required. Unlimited conversions for all your legacy dBase data needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
