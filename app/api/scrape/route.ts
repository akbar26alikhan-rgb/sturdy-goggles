import { NextRequest, NextResponse } from 'next/server';
import { scrapeProductPrices } from '../../../lib/scraper';

interface ApiResponse {
  success: boolean;
  results: Array<{ site: string; url: string; price: string; title: string; }>;
  summary: {
    totalResults: number;
    successCount: number;
    errorCount: number;
    searchQuery: string;
    error?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName } = body;

    // Validate input
    if (!productName || typeof productName !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Product name is required and must be a string',
          results: [],
        },
        { status: 400 }
      );
    }

    // Clean product name
    const cleanProductName = productName.trim();
    if (cleanProductName.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product name cannot be empty',
          results: [],
        },
        { status: 400 }
      );
    }

    // Limit product name length
    if (cleanProductName.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product name is too long (max 200 characters)',
          results: [],
        },
        { status: 400 }
      );
    }

    console.log(`API: Starting search for "${cleanProductName}"`);

    // Perform the scraping
    const searchResults = await scrapeProductPrices(cleanProductName);

    // Format response
    const response: ApiResponse = {
      success: searchResults.success,
      results: searchResults.results.map(result => ({
        site: result.site,
        url: result.url,
        price: result.price,
        title: result.title,
      })),
      summary: {
        totalResults: searchResults.totalResults,
        successCount: searchResults.successCount,
        errorCount: searchResults.errorCount,
        searchQuery: cleanProductName,
      },
    };

    // Add error message if there were issues
    if (!searchResults.success && searchResults.errorCount > 0) {
      response.summary.error = `Completed with ${searchResults.errorCount} errors. Some sites may be blocking requests.`;
    }

    console.log(`API: Search completed successfully. Found ${searchResults.successCount} results from ${searchResults.totalResults} sources.`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('API Error:', error);

    // Return a friendly error response
    const errorResponse: ApiResponse = {
      success: false,
      results: [],
      summary: {
        totalResults: 0,
        successCount: 0,
        errorCount: 1,
        searchQuery: 'Unknown',
        error: 'Internal server error occurred while searching',
      },
    };

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Product Search API',
    endpoint: 'POST /api/scrape',
    example: {
      productName: 'iPhone 15',
    },
    status: 'running',
  });
}