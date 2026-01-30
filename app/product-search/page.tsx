'use client';

import React, { useState } from 'react';
import SearchResults from '@/components/SearchResults';

interface ApiResponse {
  success: boolean;
  results: Array<{
    site: string;
    url: string;
    price: string;
    title: string;
  }>;
  summary: {
    totalResults: number;
    successCount: number;
    errorCount: number;
    searchQuery: string;
    error?: string;
  };
}

export default function ProductSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse['results']>([]);
  const [searchSummary, setSearchSummary] = useState<ApiResponse['summary'] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a product name to search');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);
    setSearchSummary(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: searchQuery.trim(),
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.summary?.error || 'Search failed');
      }

      setResults(data.results || []);
      setSearchSummary(data.summary);

      if (!data.success) {
        setError(data.summary?.error || 'Search completed with errors');
      }

    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to search. Please try again.';
      setError(errorMessage);
      setResults([]);
      setSearchSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const popularSearches = [
    'iPhone 15',
    'MacBook Pro',
    'AirPods Pro',
    'Gaming Laptop',
    'Samsung TV',
    'PlayStation 5',
    'Nike Shoes',
    'KitchenAid Mixer'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔍 Product Price Aggregator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the best prices by searching across Google and multiple e-commerce platforms simultaneously
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Enter a product name (e.g., iPhone 15, gaming laptop, Nike shoes...)"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isLoading || !searchQuery.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">❌</div>
                <div className="text-red-800">{error}</div>
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!hasSearched && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Searches:</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSearchQuery(item)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* How It Works */}
          {!hasSearched && (
            <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">1️⃣</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enter Product</h3>
                  <p className="text-gray-600 text-sm">
                    Type in any product name you want to search for
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">2️⃣</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-time Scraping</h3>
                  <p className="text-gray-600 text-sm">
                    We search Google and multiple e-commerce sites simultaneously
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">3️⃣</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Compare Prices</h3>
                  <p className="text-gray-600 text-sm">
                    Get results sorted by price with direct links to buy
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Data Sources Info */}
          {!hasSearched && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">📊 Data Sources</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>• Google Search</div>
                <div>• Amazon</div>
                <div>• eBay</div>
                <div>• Walmart</div>
                <div>• Target</div>
                <div>• Best Buy</div>
                <div>• And more...</div>
                <div className="text-blue-600 font-medium">• Real-time prices</div>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <SearchResults
          results={results}
          isLoading={isLoading}
          searchQuery={searchSummary?.searchQuery || searchQuery}
          totalResults={searchSummary?.totalResults || 0}
          successCount={searchSummary?.successCount || 0}
          errorCount={searchSummary?.errorCount || 0}
          hasSearched={hasSearched}
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              <strong>⚠️ Important:</strong> This tool is for educational and research purposes. 
              Please respect the terms of service of the websites being scraped.
            </p>
            <p>
              Some sites may block automated requests. Results are cached for 30 minutes to reduce server load.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}