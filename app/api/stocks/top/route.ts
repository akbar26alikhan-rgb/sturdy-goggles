import { NextRequest, NextResponse } from 'next/server';
import { getStockData, calculateScores } from '@/lib/scanner';
import prisma from '@/lib/prisma';

const TICKERS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK',
  'AXISBANK', 'ASIANPAINT', 'MARUTI', 'SUNPHARMA', 'HCLTECH', 'WIPRO', 'LT', 'TITAN', 'BAJFINANCE', 'NESTLEIND'
];

export async function GET(request: NextRequest) {
  const refresh = request.nextUrl.searchParams.get('refresh') === 'true';
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
  
  try {
    // Try to get from DB first
    let stocks: any[] = [];
    
    // For the sake of this environment where DB might not be ready, 
    // we'll check if we can even query the DB.
    let dbWorks = false;
    try {
      stocks = await prisma.stock.findMany({
        include: { scoring: true },
        orderBy: { scoring: { totalScore: 'desc' } },
        take: limit
      });
      dbWorks = true;
    } catch (e) {
      console.error("DB Error:", e);
    }

    if (stocks.length === 0 || refresh || !dbWorks) {
      // Perform fresh scan for a few stocks (to avoid rate limits and slow response)
      const scannedStocks = [];
      const tickersToScan = TICKERS.slice(0, limit);
      
      for (const ticker of tickersToScan) {
        const data = await getStockData(ticker);
        if (data) {
          const scores = calculateScores(data.quote, data.history);
          const stockInfo = {
            symbol: ticker,
            name: data.quote.longName || ticker,
            currentPrice: data.quote.regularMarketPrice,
            dayChangePercent: data.quote.regularMarketChangePercent,
            volume: data.quote.regularMarketVolume,
            totalScore: scores.total,
            tradeGrade: scores.grade,
            scoring: scores,
            dma50: scores.trend > 0 ? data.quote.fiftyDayAverage : null,
            dma200: scores.trend > 0 ? data.quote.twoHundredDayAverage : null,
            peRatio: data.quote.trailingPE,
          };
          scannedStocks.push(stockInfo);
          
          // Try to save to DB if it works
          if (dbWorks) {
            try {
              await prisma.stock.upsert({
                where: { symbol: ticker },
                update: {
                  lastPrice: stockInfo.currentPrice,
                  volume: stockInfo.volume,
                  updatedAt: new Date(),
                  scoring: {
                    upsert: {
                      create: {
                        trendScore: scores.trend,
                        volumeScore: scores.volume,
                        breakoutScore: scores.breakout,
                        growthScore: scores.growth,
                        financialScore: scores.financial,
                        valuationScore: scores.valuation,
                        institutionalScore: scores.institutional,
                        sectorScore: scores.sector,
                        totalScore: scores.total,
                        tradeGrade: scores.grade,
                        updatedAt: new Date(),
                      },
                      update: {
                        trendScore: scores.trend,
                        volumeScore: scores.volume,
                        breakoutScore: scores.breakout,
                        growthScore: scores.growth,
                        financialScore: scores.financial,
                        valuationScore: scores.valuation,
                        institutionalScore: scores.institutional,
                        sectorScore: scores.sector,
                        totalScore: scores.total,
                        tradeGrade: scores.grade,
                        updatedAt: new Date(),
                      }
                    }
                  }
                },
                create: {
                  symbol: ticker,
                  name: stockInfo.name,
                  lastPrice: stockInfo.currentPrice,
                  volume: stockInfo.volume,
                  scoring: {
                    create: {
                      trendScore: scores.trend,
                      volumeScore: scores.volume,
                      breakoutScore: scores.breakout,
                      growthScore: scores.growth,
                      financialScore: scores.financial,
                      valuationScore: scores.valuation,
                      institutionalScore: scores.institutional,
                      sectorScore: scores.sector,
                      totalScore: scores.total,
                      tradeGrade: scores.grade,
                    }
                  }
                }
              });
            } catch (dbSaveError) {
              console.error(`Failed to save ${ticker} to DB`, dbSaveError);
            }
          }
        }
      }
      stocks = scannedStocks.sort((a, b) => b.totalScore - a.totalScore);
    }

    return NextResponse.json({
      success: true,
      data: {
        stocks: stocks.map(s => ({
          symbol: s.symbol,
          name: s.name,
          currentPrice: s.currentPrice || s.lastPrice,
          dayChangePercent: s.dayChangePercent,
          volume: s.volume,
          totalScore: s.totalScore || s.scoring?.totalScore,
          tradeGrade: s.tradeGrade || s.scoring?.tradeGrade,
          dma50: s.dma50,
          dma200: s.dma200,
          peRatio: s.peRatio,
        })),
        lastUpdate: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
