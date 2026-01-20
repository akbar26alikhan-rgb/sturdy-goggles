'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TimeSeriesData, ChartConfig } from '@/lib/types';
import { formatDate, formatCurrency, formatNumber } from '@/lib/formatters';
import { useTheme } from '@/context/ThemeContext';

interface StockChartProps {
  data: TimeSeriesData | null;
  loading?: boolean;
  error?: string | null;
  config?: ChartConfig;
  onConfigChange?: (config: ChartConfig) => void;
  className?: string;
  height?: number;
}

interface ChartDataPoint {
  timestamp: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  movingAverage?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currentConfig: ChartConfig;
  isDark: boolean;
}

const CustomTooltip = ({ active, payload, currentConfig, isDark }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`
        p-4 rounded-lg border shadow-lg
        ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
      `}>
        <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {data.date}
        </p>
        <div className="space-y-1 text-sm">
          {currentConfig.type === 'candlestick' ? (
            <>
              <div className="flex justify-between gap-4">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Open:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(data.open)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>High:</span>
                <span className="text-green-600 dark:text-green-400">{formatCurrency(data.high)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Low:</span>
                <span className="text-red-600 dark:text-red-400">{formatCurrency(data.low)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Close:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(data.close)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between gap-4">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Price:</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(data.close)}</span>
            </div>
          )}
          {currentConfig.showVolume && (
            <div className="flex justify-between gap-4">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Volume:</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatNumber(data.volume, { abbreviation: true })}</span>
            </div>
          )}
          {currentConfig.showMovingAverage && data.movingAverage && (
            <div className="flex justify-between gap-4">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>MA({currentConfig.period}):</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(data.movingAverage)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function StockChart({ 
  data, 
  loading = false, 
  error = null,
  config,
  onConfigChange,
  className = "",
  height = 400
}: StockChartProps) {
  const [localConfig, setLocalConfig] = useState<ChartConfig>({
    type: 'line',
    interval: '1D',
    showVolume: false,
    showMovingAverage: false,
    period: 20,
    ...config
  });
  
  const { isDark } = useTheme();
  
  const currentConfig = config || localConfig;
  const handleConfigChange = onConfigChange || setLocalConfig;

  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data?.candles) return [];
    
    return data.candles.map((candle, index, array) => {
      const point: ChartDataPoint = {
        timestamp: candle.timestamp,
        date: formatDate(candle.timestamp, 'MMM dd'),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume
      };
      
      // Calculate moving average
      if (currentConfig.showMovingAverage && index >= (currentConfig.period || 20) - 1) {
        const period = currentConfig.period || 20;
        const sum = array.slice(index - period + 1, index + 1).reduce((acc, c) => acc + c.close, 0);
        point.movingAverage = sum / period;
      }
      
      return point;
    });
  }, [data, currentConfig.showMovingAverage, currentConfig.period]);

  if (loading) {
    return <ChartSkeleton height={height} className={className} />;
  }

  if (error) {
    return (
      <div className={`
        flex items-center justify-center rounded-lg border-2
        ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
        ${className}
      `} style={{ height }}>
        <div className="text-center">
          <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            Chart Error
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <div className={`
        flex items-center justify-center rounded-lg border-2
        ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
        ${className}
      `} style={{ height }}>
        <div className="text-center">
          <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No Chart Data
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No historical data available for this stock
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Chart Type Toggle */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Chart Type:
          </span>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => handleConfigChange({ ...currentConfig, type: 'line' })}
              className={`
                px-3 py-1 text-sm font-medium transition-colors
                ${currentConfig.type === 'line'
                  ? 'bg-blue-600 text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Line
            </button>
            <button
              onClick={() => handleConfigChange({ ...currentConfig, type: 'candlestick' })}
              className={`
                px-3 py-1 text-sm font-medium transition-colors
                ${currentConfig.type === 'candlestick'
                  ? 'bg-blue-600 text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Candlestick
            </button>
          </div>
        </div>

        {/* Time Interval */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Interval:
          </span>
          <div className="flex rounded-lg border overflow-hidden">
            {(['1D', '1W', '1M'] as const).map((interval) => (
              <button
                key={interval}
                onClick={() => handleConfigChange({ ...currentConfig, interval })}
                className={`
                  px-3 py-1 text-sm font-medium transition-colors
                  ${currentConfig.interval === interval
                    ? 'bg-blue-600 text-white'
                    : isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {interval}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Toggle */}
        {currentConfig.showVolume !== undefined && (
          <button
            onClick={() => handleConfigChange({ ...currentConfig, showVolume: !currentConfig.showVolume })}
            className={`
              px-3 py-1 text-sm font-medium rounded-lg border transition-colors
              ${currentConfig.showVolume
                ? 'bg-green-600 text-white border-green-600'
                : isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            Volume
          </button>
        )}

        {/* Moving Average Toggle */}
        {currentConfig.showMovingAverage !== undefined && (
          <button
            onClick={() => handleConfigChange({ ...currentConfig, showMovingAverage: !currentConfig.showMovingAverage })}
            className={`
              px-3 py-1 text-sm font-medium rounded-lg border transition-colors
              ${currentConfig.showMovingAverage
                ? 'bg-orange-600 text-white border-orange-600'
                : isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            MA {currentConfig.period || 20}
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-lg border-2 p-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
              tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
              tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
              tickFormatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Tooltip 
              content={
                <CustomTooltip 
                  currentConfig={currentConfig} 
                  isDark={isDark} 
                />
              } 
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
              name="Close Price"
            />
            {currentConfig.showMovingAverage && (
              <Line 
                type="monotone" 
                dataKey="movingAverage" 
                stroke="#F59E0B" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name={`Moving Average (${currentConfig.period})`}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart (if enabled) */}
      {currentConfig.showVolume && (
        <div className="mt-4 rounded-lg border-2 p-4" style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#374151' : '#E5E7EB'} 
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
                tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
                tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
                tickFormatter={(value: number) => `${(value / 1e6).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [formatNumber(value, { abbreviation: true }), 'Volume']}
                labelStyle={{ color: isDark ? '#F3F4F6' : '#111827' }}
                contentStyle={{
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="volume" 
                fill={isDark ? '#6B7280' : '#9CA3AF'}
                name="Volume"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart Info */}
      <div className="mt-4 text-center">
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {data.symbol} • {data.interval} • Last updated: {formatDate(data.lastUpdated)}
        </p>
      </div>
    </div>
  );
}

// Skeleton loading component
function ChartSkeleton({ height = 400, className = "" }: { height?: number; className?: string }) {
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