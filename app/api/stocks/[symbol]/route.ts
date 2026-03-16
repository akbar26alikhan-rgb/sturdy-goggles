import { NextRequest, NextResponse } from 'next/server';
import { getStockData, calculateScores } from '@/lib/scanner';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase();
  
  try {
    const data = await getStockData(symbol);
    if (!data) {
      return NextResponse.json({ success: false, error: 'Stock not found' }, { status: 404 });
    }

    const scores = calculateScores(data.quote, data.history);
    
    // Attempt to update DB
    try {
      await prisma.stock.upsert({
        where: { symbol },
        update: {
          lastPrice: data.quote.regularMarketPrice,
          volume: data.quote.regularMarketVolume,
          updatedAt: new Date(),
        },
        create: {
          symbol,
          name: data.quote.longName || symbol,
          lastPrice: data.quote.regularMarketPrice,
          volume: data.quote.regularMarketVolume,
        }
      });
    } catch (e) {
      console.error("DB update failed in detail route", e);
    }

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        name: data.quote.longName,
        price: data.quote.regularMarketPrice,
        change: data.quote.regularMarketChange,
        changePercent: data.quote.regularMarketChangePercent,
        volume: data.quote.regularMarketVolume,
        marketCap: data.quote.marketCap,
        peRatio: data.quote.trailingPE,
        high52: data.quote.fiftyTwoWeekHigh,
        low52: data.quote.fiftyTwoWeekLow,
        scores,
        history: data.history.slice(-30).map(h => ({
          date: h.date,
          close: h.close,
          volume: h.volume
        })),
        details: {
          sector: data.quote.sector,
          industry: data.quote.industry,
          summary: data.quote.longBusinessSummary
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
