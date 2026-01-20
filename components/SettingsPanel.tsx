'use client';

import { useState, useEffect } from 'react';
import { useWatchlistSettings } from '@/hooks/useWatchlist';
import { useTheme } from '@/context/ThemeContext';
import { stockAPI } from '@/lib/stockApi';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function SettingsPanel({ isOpen, onClose, className = "" }: SettingsPanelProps) {
  const { settings, updateSetting, resetSettings, clearSettings } = useWatchlistSettings();
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState({ remaining: 0, limit: 100, resetTime: 0 });

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('alpha_vantage_key') || '';
    setApiKey(savedKey);
  }, []);

  // Update rate limit info periodically
  useEffect(() => {
    const updateRateLimit = () => {
      const info = stockAPI.getRateLimitInfo();
      setRateLimitInfo({ ...info, resetTime: info.resetTime });
    };

    updateRateLimit();
    const interval = setInterval(updateRateLimit, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('alpha_vantage_key', apiKey);
    // You might want to show a success message or reload the page
    alert('API key saved! Please refresh the page for changes to take effect.');
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('alpha_vantage_key');
    setApiKey('');
    alert('API key cleared! Please refresh the page for changes to take effect.');
  };

  const handleClearCache = () => {
    stockAPI.clearCache();
    localStorage.clear(); // Clear all cached data
    alert('All cache cleared!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`
        w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl
        ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
        }
        border-2 ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-lg transition-colors
              ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <div className="flex rounded-lg border overflow-hidden">
                  {(['light', 'dark', 'system'] as const).map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className={`
                        px-4 py-2 text-sm font-medium transition-colors capitalize
                        ${theme === themeOption
                          ? 'bg-blue-600 text-white'
                          : themeOption === 'dark' || (themeOption === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {themeOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Watchlist Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.autoRefresh}
                    onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Auto-refresh watchlist</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Refresh Interval: {settings.refreshInterval} seconds
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={settings.refreshInterval}
                  onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default View</label>
                <select
                  value={settings.defaultView}
                  onChange={(e) => updateSetting('defaultView', e.target.value as 'grid' | 'list')}
                  className={`
                    w-full px-3 py-2 rounded-lg border text-sm
                    ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                  `}
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={settings.sortBy}
                    onChange={(e) => updateSetting('sortBy', e.target.value as 'symbol' | 'addedAt' | 'price')}
                    className={`
                      flex-1 px-3 py-2 rounded-lg border text-sm
                      ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}
                  >
                    <option value="symbol">Symbol</option>
                    <option value="addedAt">Date Added</option>
                    <option value="price">Price</option>
                  </select>
                  <button
                    onClick={() => updateSetting('sortOrder', settings.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={`
                      px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                      ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {settings.sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Alpha Vantage API Key</label>
                <div className="flex gap-2">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Alpha Vantage API key"
                    className={`
                      flex-1 px-3 py-2 rounded-lg border text-sm
                      ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                    `}
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                      ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {showApiKey ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKey}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${!apiKey
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }
                    `}
                  >
                    Save
                  </button>
                  {apiKey && (
                    <button
                      onClick={handleClearApiKey}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Get your free API key at{' '}
                  <a 
                    href="https://www.alphavantage.co/support/#api-key" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Alpha Vantage
                  </a>
                </p>
              </div>

              {/* Rate Limit Info */}
              <div className={`
                p-3 rounded-lg border
                ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
                }
              `}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">API Usage</span>
                  <span className="text-xs text-gray-500">
                    Resets in {rateLimitInfo.resetTime > 0 ? Math.ceil((rateLimitInfo.resetTime - Date.now()) / (1000 * 60 * 60)) : 24}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((rateLimitInfo.limit - rateLimitInfo.remaining) / rateLimitInfo.limit) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{rateLimitInfo.remaining} remaining</span>
                  <span>{rateLimitInfo.limit} total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cache Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cache & Data</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.showNotifications}
                    onChange={(e) => updateSetting('showNotifications', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Show notifications</span>
                </label>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClearCache}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                >
                  Clear All Cache
                </button>
                
                <button
                  onClick={() => {
                    resetSettings();
                    alert('Settings reset to defaults!');
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
                >
                  Reset Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`
          flex justify-end gap-3 p-6 border-t-2
          ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ? 'border-gray-700 bg-gray-750'
            : 'border-gray-200 bg-gray-50'
          }
        `}>
          <button
            onClick={onClose}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }
            `}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}