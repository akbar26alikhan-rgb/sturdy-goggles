import { NextRequest, NextResponse } from 'next/server';
import { stockAPI } from '@/lib/stockApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { 
          data: [], 
          message: 'Query must be at least 2 characters long' 
        },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
          }
        }
      );
    }

    try {
      const results = await stockAPI.searchSymbols(query);
      
      // Limit results to prevent abuse
      const limitedResults = results.slice(0, 20);
      
      return NextResponse.json(
        { 
          data: limitedResults,
          count: limitedResults.length,
          query,
          timestamp: new Date().toISOString()
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=600, s-maxage=1200', // 10 minutes client, 20 minutes edge
            'CDN-Cache-Control': 'public, s-maxage=1200',
            'Vercel-CDN-Cache-Control': 'public, s-maxage=1200'
          }
        }
      );
    } catch (searchError) {
      console.error('Symbol search API error:', searchError);
      
      // Fallback to basic stock suggestions for common symbols
      const commonStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'V', name: 'Visa Inc.', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Equity', region: 'United States', currency: 'USD' },
        { symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited', type: 'Equity', region: 'India', currency: 'INR' },
        { symbol: 'TCS', name: 'Tata Consultancy Services Limited', type: 'Equity', region: 'India', currency: 'INR' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', type: 'Equity', region: 'India', currency: 'INR' },
        { symbol: 'INFY', name: 'Infosys Limited', type: 'Equity', region: 'India', currency: 'INR' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', type: 'Equity', region: 'India', currency: 'INR' }
      ];
      
      const filtered = commonStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
      
      return NextResponse.json(
        { 
          data: filtered,
          count: filtered.length,
          query,
          message: 'Search service unavailable, showing common stocks',
          timestamp: new Date().toISOString()
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=60' // Cache fallback for 1 minute
          }
        }
      );
    }
  } catch (error) {
    console.error('Ticker search error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Unable to process search request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'X-Service-Status': 'healthy',
      'X-Cache-Enabled': 'true'
    }
  });
}