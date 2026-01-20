import { NextRequest, NextResponse } from 'next/server';
import { stockAPI } from '@/lib/stockApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval') as '1D' | '1W' | '1M' | null;
    const type = searchParams.get('type') || 'quote';

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Set cache headers for better performance
    const cacheHeaders = {
      'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 minutes client, 10 minutes edge
      'CDN-Cache-Control': 'public, s-maxage=600',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=600'
    };

    if (type === 'quote') {
      try {
        const quote = await stockAPI.getQuote(symbol);
        return NextResponse.json(
          { data: quote, timestamp: new Date().toISOString() },
          { headers: cacheHeaders }
        );
      } catch (error) {
        console.error('Stock quote API error:', error);
        return NextResponse.json(
          { 
            error: error instanceof Error ? error.message : 'Failed to fetch stock quote',
            symbol 
          },
          { status: 500 }
        );
      }
    } else if (type === 'timeseries' && interval) {
      try {
        const timeSeries = await stockAPI.getTimeSeries(symbol, interval);
        return NextResponse.json(
          { data: timeSeries, timestamp: new Date().toISOString() },
          { headers: cacheHeaders }
        );
      } catch (error) {
        console.error('Stock time series API error:', error);
        return NextResponse.json(
          { 
            error: error instanceof Error ? error.message : 'Failed to fetch time series data',
            symbol,
            interval
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter. Use "quote" or "timeseries"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Rate limiting for API routes
export async function HEAD(request: NextRequest) {
  // Basic rate limiting check
  const clientIP = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  const now = Date.now();
  const rateLimitKey = `rate_limit_${clientIP}`;
  
  // This is a simple in-memory rate limiter
  // In production, you might want to use Redis or similar
  const rateLimits = new Map();
  
  const currentLimit = rateLimits.get(rateLimitKey) || { count: 0, resetTime: now + 60000 }; // 1 minute window
  
  if (now > currentLimit.resetTime) {
    currentLimit.count = 0;
    currentLimit.resetTime = now + 60000;
  }
  
  currentLimit.count++;
  rateLimits.set(rateLimitKey, currentLimit);
  
  if (currentLimit.count > 100) { // 100 requests per minute
    return new Response(null, { 
      status: 429, 
      headers: { 
        'Retry-After': '60',
        'X-RateLimit-Remaining': '0'
      }
    });
  }
  
  return new Response(null, {
    status: 200,
    headers: {
      'X-RateLimit-Remaining': String(100 - currentLimit.count),
      'X-RateLimit-Reset': String(Math.floor(currentLimit.resetTime / 1000))
    }
  });
}