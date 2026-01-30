'use client';

import React from 'react';

interface SearchResult {
  site: string;
  url: string;
  price: string;
  title: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchQuery: string;
  totalResults: number;
  successCount: number;
  errorCount: number;
  hasSearched: boolean;
}

export default function SearchResults({
  results,
  isLoading,
  searchQuery,
  totalResults,
  successCount,
  errorCount,
  hasSearched,
}: SearchResultsProps) {
  // Sort results by price (put "Price not available" at the end)
  const sortedResults = React.useMemo(() => {
    return [...results].sort((a, b) => {
      const aPrice = a.price.toLowerCase().includes('not available') ? 'z' : a.price;
      const bPrice = b.price.toLowerCase().includes('not available') ? 'z' : b.price;
      
      // Extract numeric value for comparison
      const aMatch = aPrice.match(/[\d,]+\.?\d*/);
      const bMatch = bPrice.match(/[\d,]+\.?\d*/);
      
      if (aMatch && bMatch) {
        const aNum = parseFloat(aMatch[0].replace(/,/g, ''));
        const bNum = parseFloat(bMatch[0].replace(/,/g, ''));
        return aNum - bNum;
      }
      
      return aPrice.localeCompare(bPrice);
    });
  }, [results]);

  const handleLinkClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-lg text-gray-600">Searching for prices...</div>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            This may take 10-30 seconds as we check multiple sites
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              We couldn&apos;t find any products for &quot;{searchQuery}&quot;. Try different keywords or check your spelling.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      {/* Search Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Search Results for &quot;{searchQuery}&quot;
          </h2>
          <div className="flex items-center space-x-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ {successCount} Success
            </span>
            {errorCount > 0 && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                ✗ {errorCount} Errors
              </span>
            )}
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              📊 {totalResults} Total
            </span>
          </div>
        </div>
        
        {errorCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-2">⚠️</div>
              <div className="text-sm text-yellow-800">
                Some websites blocked our requests or returned errors. This is normal as many sites 
                try to prevent automated scraping. We found results from {successCount} sources.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Price Comparison Results
          </h3>
        </div>
        
        {sortedResults.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <p className="text-gray-600">No valid results to display</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedResults.map((result, index) => (
                  <tr 
                    key={`${result.site}-${index}`}
                    className={`hover:bg-gray-50 transition-colors ${
                      result.price.toLowerCase().includes('not available') ? 'opacity-75' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {result.site}
                        </div>
                        {result.site === 'Google Search' && (
                          <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Google
                        </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {result.title || 'Product information not available'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        result.price.toLowerCase().includes('not available') 
                          ? 'text-gray-500' 
                          : 'text-green-600'
                      }`}>
                        {result.price}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {result.url ? (
                        <button
                          onClick={() => handleLinkClick(result.url)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Visit
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3 mt-0.5">💡</div>
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> Prices are updated in real-time from the source websites. 
            Some sites may block automated requests, which is why you might see &quot;Price not available&quot; for certain sources. 
            Click &quot;Visit&quot; to view the current prices directly on the website.
          </div>
        </div>
      </div>
    </div>
  );
}