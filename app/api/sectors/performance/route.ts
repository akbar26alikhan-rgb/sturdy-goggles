import { NextResponse } from 'next/server';

export async function GET() {
  const sectors = [
    { name: 'NIFTY IT', performance: 1.25, trend: 'bullish' },
    { name: 'NIFTY BANK', performance: -0.45, trend: 'bearish' },
    { name: 'NIFTY AUTO', performance: 0.85, trend: 'bullish' },
    { name: 'NIFTY PHARMA', performance: 2.10, trend: 'strong_bullish' },
    { name: 'NIFTY FMCG', performance: 0.15, trend: 'neutral' },
    { name: 'NIFTY METAL', performance: -1.20, trend: 'bearish' },
  ];

  return NextResponse.json({
    success: true,
    data: sectors
  });
}
