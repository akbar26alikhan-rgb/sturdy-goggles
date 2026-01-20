'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface LoadingSkeletonsProps {
  className?: string;
  count?: number;
}

export default function LoadingSkeletons({ className = "", count = 6 }: LoadingSkeletonsProps) {
  const { isDark } = useTheme();

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <StockCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function StockCardSkeleton({ className = "" }: { className?: string }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`
      p-6 rounded-xl border-2 animate-pulse
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      ${className}
    `}>
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={`h-6 rounded w-20 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        <div className="flex gap-2">
          <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {/* Price skeleton */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <div className={`h-8 rounded w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-6 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        <div className={`h-3 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className={`h-3 rounded w-12 mb-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className={`h-3 rounded w-16 mb-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 400, className = "" }: { height?: number; className?: string }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`
      rounded-lg border-2 animate-pulse
      ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
      ${className}
    `} style={{ height }}>
      <div className="p-4">
        {/* Controls skeleton */}
        <div className="flex gap-4 mb-6">
          <div className={`h-8 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-8 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-8 rounded w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        
        {/* Chart area skeleton */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 rounded w-32 mx-auto ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TickerTapeSkeleton({ className = "" }: { className?: string }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`
      w-full overflow-hidden border-b-2
      ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
      ${className}
    `}>
      <div className="flex items-center gap-8 py-3 whitespace-nowrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`h-4 w-12 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-16 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-20 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`w-px h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WatchlistSkeleton({ className = "" }: { className?: string }) {
  const { isDark } = useTheme();
  
  return (
    <div className={className}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className={`h-8 rounded w-32 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 rounded w-48 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        <div className="flex gap-3">
          <div className={`h-10 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-10 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-10 rounded w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {/* Search form skeleton */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
        <div className={`h-12 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <StockCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}