import axios from 'axios';
import PQueue from 'p-queue';
import { SiteConfig, getRandomUserAgent } from './sites-config';

// Request queue for throttling
const requestQueue = new PQueue({
  concurrency: 3, // Maximum 3 concurrent requests
  interval: 2000, // 2 second interval
  intervalCap: 5, // Maximum 5 requests per interval
});

// Cache for storing results
interface CacheEntry {
  data: string;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class RequestCache {
  private cache = new Map<string, CacheEntry>();

  set(key: string, data: unknown, ttlMinutes: number = 30): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    this.cache.set(key, {
      data: data as string,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const requestCache = new RequestCache();

// Retry configuration
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

// HTTP client with retry logic
class HttpClient {
  private client: ReturnType<typeof axios.create>;
  private retryConfig: RetryConfig;

  constructor() {
    this.client = axios.create({
      timeout: 30000, // 30 second timeout
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // Don't throw on 4xx errors
    });

    this.retryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
    };

    // Add request interceptor to rotate User-Agent
    this.client.interceptors.request.use((config) => {
      // Randomize User-Agent for each request
      if (config.headers) {
        config.headers.set('User-Agent', getRandomUserAgent());
        config.headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        config.headers.set('Accept-Language', 'en-US,en;q=0.5');
        config.headers.set('Accept-Encoding', 'gzip, deflate');
        config.headers.set('Connection', 'keep-alive');
        config.headers.set('Cache-Control', 'no-cache');
      }
      
      return config;
    });

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => response,
      (error: Error) => {
        console.error('HTTP Request failed:', {
          url: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  // Calculate delay with exponential backoff
  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add random jitter
    return Math.min(delay + jitter, this.retryConfig.maxDelay);
  }

  // Execute request with retry logic and throttling
  async requestWithRetry(
    url: string,
    headers: Record<string, string>,
    siteName: string,
    delay?: number
  ): Promise<string> {
    const attemptDelay = delay || Math.random() * 2000 + 500; // Random delay 500-2500ms

    return requestQueue.add(async () => {
      // Add additional delay before request
      await new Promise(resolve => setTimeout(resolve, attemptDelay));

      let lastError: Error;

      for (let attempt = 0; attempt < this.retryConfig.maxAttempts; attempt++) {
        try {
          console.log(`Attempting to scrape ${siteName} (attempt ${attempt + 1}/${this.retryConfig.maxAttempts})`);

          const response = await this.client.get(url, {
            headers: {
              ...headers,
              // Rotate User-Agent on each attempt
              'User-Agent': getRandomUserAgent(),
            },
          });

          if (response.status === 200 && response.data) {
            console.log(`Successfully scraped ${siteName}`);
            return response.data;
          }

          throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.error(`Attempt ${attempt + 1} failed for ${siteName}:`, error);

          // Don't retry on certain errors
          if (error instanceof Error && 'response' in error &&
              error.response &&
              typeof error.response === 'object' &&
              'status' in error.response &&
              (error.response as { status: number }).status === 404 ||
              (error.response as { status: number }).status === 403) {
            throw new Error(`Request blocked or page not found (${(error.response as { status: number }).status})`);
          }

          if (attempt < this.retryConfig.maxAttempts - 1) {
            const delay = this.calculateDelay(attempt);
            console.log(`Retrying ${siteName} in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw new Error(`Failed after ${this.retryConfig.maxAttempts} attempts: ${lastError.message}`);
    });
  }

  // Make a request with rate limiting for a specific site
  async makeRequest(
    config: SiteConfig,
    productName: string
  ): Promise<string> {
    const encodedProduct = encodeURIComponent(productName);
    const url = config.searchUrl.replace('{product}', encodedProduct);

    try {
      const html = await this.requestWithRetry(
        url,
        config.headers,
        config.name,
        config.rateLimitDelay
      );

      return html;
    } catch (error) {
      console.error(`Error scraping ${config.name}:`, error);
      throw error;
    }
  }
}

export const httpClient = new HttpClient();

// Utility functions for common request patterns
export async function makeCachedRequest(
  key: string,
  requestFn: () => Promise<string>,
  ttlMinutes: number = 30
): Promise<string> {
  // Check cache first
  const cached = requestCache.get(key);
  if (cached && typeof cached === 'string') {
    console.log(`Cache hit for key: ${key}`);
    return cached;
  }

  console.log(`Cache miss for key: ${key}, making request...`);
  const result = await requestFn();

  // Store in cache
  requestCache.set(key, result, ttlMinutes);

  return result;
}

export function generateCacheKey(productName: string, siteName: string): string {
  return `${siteName.toLowerCase().replace(/\s+/g, '_')}_${productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}