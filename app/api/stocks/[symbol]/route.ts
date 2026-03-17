import { NextRequest, NextResponse } from 'next/server';
import { getStockData, calculateScores } from '@/lib/scanner';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: symbolParam } = await params;
  const symbol = symbolParam.toUpperCase();
  
  try {
    const data = await getStockData(symbol);
    if (!data) {
      return NextResponse.json({ success: false, error: 'Stock not found' }, { status: 404 });
    }

    const { quote, history } = data;
    const scores = calculateScores(quote, history);
    
    // Attempt to update DB
    try {
      await prisma.stock.upsert({
        where: { symbol },
        update: {
          lastPrice: quote.regularMarketPrice,
          volume: quote.regularMarketVolume,
          updatedAt: new Date(),
        },
        create: {
          symbol,
          name: quote.longName || symbol,
          lastPrice: quote.regularMarketPrice,
          volume: quote.regularMarketVolume,
        }
      });
    } catch (e) {
      console.error("DB update failed in detail route", e);
    }

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        name: quote.longName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        high52: quote.fiftyTwoWeekHigh,
        low52: quote.fiftyTwoWeekLow,
        scores,
        history: history.slice(-30).map(h => ({
          date: h.date,
          close: h.close,
          volume: h.volume
        })),
        details: {
          sector: quote.sector,
          industry: quote.industry,
          summary: quote.longBusinessSummary
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
