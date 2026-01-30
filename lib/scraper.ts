import * as cheerio from 'cheerio';
import { siteConfigs, googleSearchConfig, SiteConfig } from './sites-config';
import { httpClient, makeCachedRequest, generateCacheKey } from './request-handler';

export interface ScrapedResult {
  site: string;
  url: string;
  price: string;
  title: string;
  success: boolean;
  error?: string;
}

export interface SearchResults {
  results: ScrapedResult[];
  success: boolean;
  totalResults: number;
  successCount: number;
  errorCount: number;
}

// Utility function to extract price from various formats
function extractPrice(text: string): string {
  if (!text) return 'Price not available';

  // Common price patterns
  const pricePatterns = [
    /\$[\d,]+\.?\d{0,2}/g, // $123.45, $1,234
    /USD\s*\$?[\d,]+\.?\d{0,2}/gi, // USD $123.45
    /US\s*\$?[\d,]+\.?\d{0,2}/gi, // US $123.45
    /[\d,]+\.?\d{0,2}\s*USD/gi, // 123.45 USD
    /From\s*\$?[\d,]+\.?\d{0,2}/gi, // From $123.45
    /Starting\s*at\s*\$?[\d,]+\.?\d{0,2}/gi, // Starting at $123.45
    /[\d,]+\s*dollars?/gi, // 123 dollars
  ];

  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      return match[0].trim();
    }
  }

  // If no pattern matches, try to find any number that could be a price
  const numberMatch = text.match(/[\d,]+\.?\d{0,2}/);
  if (numberMatch && numberMatch[0]) {
    return `$${numberMatch[0]}`;
  }

  return 'Price not available';
}

// Utility function to clean and format URLs
function formatUrl(url: string, baseUrl: string): string {
  if (!url) return '';

  // If URL is relative, make it absolute
  if (url.startsWith('/')) {
    const base = new URL(baseUrl);
    return `${base.protocol}//${base.host}${url}`;
  }

  // Ensure URL has protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }

  return url;
}

// Generic scraper for e-commerce sites
async function scrapeEcommerceSite(config: SiteConfig, productName: string): Promise<ScrapedResult> {
  try {
    const cacheKey = generateCacheKey(productName, config.name);
    const html = await makeCachedRequest(
      cacheKey,
      () => httpClient.makeRequest(config, productName),
      30 // 30 minute cache
    );

    const $ = cheerio.load(html);
    const results: ScrapedResult[] = [];

    // Find all product containers
    const containers = $(config.selectors.container || config.selectors.title);
    
    if (containers.length === 0) {
      console.log(`No products found on ${config.name} for "${productName}"`);
      return {
        site: config.name,
        url: '',
        price: 'Price not available',
        title: '',
        success: false,
        error: 'No products found',
      };
    }

    // Extract first 5 products from the site
    containers.slice(0, 5).each((index, element) => {
      try {
        const $element = $(element);
        
        // Extract title
        let title = $element.find(config.selectors.title).first().text().trim();
        if (!title) {
          title = $element.attr('title') || $element.attr('alt') || $element.text().trim();
        }

        // Extract URL
        let url = $element.find(config.selectors.url).first().attr('href') || '';
        url = formatUrl(url, 'https://' + config.name.toLowerCase().replace(/\s+/g, '') + '.com');

        // Extract price
        let priceText = $element.find(config.selectors.price).first().text().trim();
        if (!priceText) {
          // Try alternative price selectors
          priceText = $element.find('[class*="price"]').first().text().trim();
        }
        const price = extractPrice(priceText);

        // Filter results by relevance (basic keyword matching)
        const productWords = productName.toLowerCase().split(' ');
        const titleWords = title.toLowerCase();
        const relevance = productWords.filter(word => titleWords.includes(word)).length;

        if (title && relevance >= Math.max(1, productWords.length * 0.5)) {
          results.push({
            site: config.name,
            url,
            price,
            title: title.substring(0, 100), // Limit title length
            success: true,
          });
        }
      } catch (error) {
        console.error(`Error parsing element on ${config.name}:`, error);
      }
    });

    if (results.length === 0) {
      return {
        site: config.name,
        url: '',
        price: 'Price not available',
        title: '',
        success: false,
        error: 'No relevant products found',
      };
    }

    // Return the most relevant result
    const bestResult = results[0];
    console.log(`Successfully scraped ${config.name}: ${bestResult.title} - ${bestResult.price}`);
    return bestResult;

  } catch (error) {
    console.error(`Failed to scrape ${config.name}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      site: config.name,
      url: '',
      price: 'Price not available',
      title: '',
      success: false,
      error: errorMessage,
    };
  }
}

// Google search scraper for general web results
async function scrapeGoogleSearch(productName: string): Promise<ScrapedResult> {
  try {
    const cacheKey = generateCacheKey(productName, 'google_search');
    const html = await makeCachedRequest(
      cacheKey,
      () => httpClient.makeRequest(googleSearchConfig, productName),
      30 // 30 minute cache
    );

    const $ = cheerio.load(html);
    const results: ScrapedResult[] = [];

    // Find search result containers
    const containers = $('.g').slice(0, 5); // First 5 results

    containers.each((index, element) => {
      try {
        const $element = $(element);
        
        // Extract title and URL
        const titleElement = $element.find('h3').first();
        const urlElement = $element.find('a').first();
        
        const title = titleElement.text().trim();
        const url = urlElement.attr('href') || '';

        // Extract price if available (look for price patterns in title and snippet)
        const snippet = $element.find('.VwiC3b').text().trim();
        const price = extractPrice(title + ' ' + snippet);

        // Filter results by relevance
        const productWords = productName.toLowerCase().split(' ');
        const contentWords = (title + ' ' + snippet).toLowerCase();
        const relevance = productWords.filter(word => contentWords.includes(word)).length;

        if (title && url && relevance >= Math.max(1, productWords.length * 0.3)) {
          results.push({
            site: 'Google Search',
            url,
            price,
            title: title.substring(0, 100),
            success: true,
          });
        }
      } catch (error) {
        console.error('Error parsing Google search result:', error);
      }
    });

    if (results.length === 0) {
      return {
        site: 'Google Search',
        url: '',
        price: 'Price not available',
        title: '',
        success: false,
        error: 'No relevant results found',
      };
    }

    // Return the most relevant result
    const bestResult = results[0];
    console.log(`Successfully scraped Google Search: ${bestResult.title} - ${bestResult.price}`);
    return bestResult;

  } catch (error) {
    console.error(`Failed to scrape Google Search:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      site: 'Google Search',
      url: '',
      price: 'Price not available',
      title: '',
      success: false,
      error: errorMessage,
    };
  }
}

// Main scraping function
export async function scrapeProductPrices(productName: string): Promise<SearchResults> {
  console.log(`Starting price scrape for: "${productName}"`);

  if (!productName || productName.trim().length === 0) {
    return {
      results: [],
      success: false,
      totalResults: 0,
      successCount: 0,
      errorCount: 0,
    };
  }

  const results: ScrapedResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  try {
    // Scrape Google Search first (usually faster)
    console.log('Scraping Google Search...');
    const googleResult = await scrapeGoogleSearch(productName);
    results.push(googleResult);
    if (googleResult.success) successCount++;
    else errorCount++;

    // Small delay before starting e-commerce scraping
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Scrape e-commerce sites
    for (const config of siteConfigs) {
      try {
        console.log(`Scraping ${config.name}...`);
        const result = await scrapeEcommerceSite(config, productName);
        results.push(result);
        
        if (result.success) successCount++;
        else errorCount++;

        // Add delay between different sites to avoid rate limiting
        if (siteConfigs.indexOf(config) < siteConfigs.length - 1) {
          const delay = Math.random() * 2000 + 1000; // Random delay 1-3 seconds
          console.log(`Waiting ${Math.round(delay)}ms before next site...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        console.error(`Error with ${config.name}:`, error);
        results.push({
          site: config.name,
          url: '',
          price: 'Price not available',
          title: '',
          success: false,
          error: error.message,
        });
        errorCount++;
      }
    }

    console.log(`Scraping completed. Success: ${successCount}, Errors: ${errorCount}`);

    // Sort results by success status (successful results first)
    const sortedResults = results.sort((a, b) => {
      if (a.success && !b.success) return -1;
      if (!a.success && b.success) return 1;
      return 0;
    });

    return {
      results: sortedResults,
      success: true,
      totalResults: sortedResults.length,
      successCount,
      errorCount,
    };

  } catch (error) {
    console.error('Critical error in scraping:', error);
    return {
      results,
      success: false,
      totalResults: results.length,
      successCount,
      errorCount: errorCount + 1,
    };
  }
}

// Utility function to get cache statistics
export function getCacheStats() {
  return {
    cacheSize: 'Unknown', // Would need to implement size tracking
    hitRate: 'Unknown', // Would need to implement hit rate tracking
  };
}

// Function to clear cache
export function clearScrapeCache() {
  // This would need to be implemented in the RequestCache class
  console.log('Cache clearing would be implemented here');
}