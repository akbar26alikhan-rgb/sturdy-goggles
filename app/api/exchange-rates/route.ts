import { NextRequest, NextResponse } from 'next/server';
import { fetchExchangeRate } from '@/lib/exchangeRateApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');

    if (!fromCurrency || !toCurrency) {
      return NextResponse.json(
        { error: 'Missing required parameters: from and to currencies' },
        { status: 400 }
      );
    }

    if (fromCurrency === toCurrency) {
      return NextResponse.json(
        { 
          base: fromCurrency, 
          target: toCurrency, 
          rate: 1, 
          timestamp: Date.now(),
          date: new Date().toISOString().split('T')[0]
        },
        { status: 200 }
      );
    }

    const exchangeRate = await fetchExchangeRate(fromCurrency, toCurrency);
    
    return NextResponse.json(exchangeRate, { status: 200 });
  } catch {
    console.error('API route error');
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}