// E-commerce platform configurations for scraping
export interface SiteConfig {
  name: string;
  searchUrl: string;
  selectors: {
    title: string;
    price: string;
    url: string;
    container?: string;
  };
  headers: Record<string, string>;
  rateLimitDelay: number; // milliseconds
}

// User agent rotation for avoiding blocking
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0',
];

export function getRandomUserAgent(): string {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Base configuration for all requests
export const baseHeaders = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// Site configurations
export const siteConfigs: SiteConfig[] = [
  {
    name: 'Google Shopping',
    searchUrl: 'https://www.google.com/search?q={product}&tbm=shop',
    selectors: {
      title: 'h3',
      price: '[data-attrid="price"]',
      url: 'a[href*="/shopping"]',
      container: '.sh-dgr__grid-result'
    },
    headers: {
      ...baseHeaders,
      'User-Agent': getRandomUserAgent(),
    },
    rateLimitDelay: 3000,
  },
  {
    name: 'Amazon',
    searchUrl: 'https://www.amazon.com/s?k={product}',
    selectors: {
      title: '[data-cy="title-recipe"]',
      price: '.a-price .a-offscreen',
      url: 'h2 a',
      container: '[data-component-type="s-search-result"]'
    },
    headers: {
      ...baseHeaders,
      'User-Agent': getRandomUserAgent(),
      'Accept-Language': 'en-US,en;q=0.9',
    },
    rateLimitDelay: 4000,
  },
  {
    name: 'eBay',
    searchUrl: 'https://www.ebay.com/sch/i.html?_nkw={product}',
    selectors: {
      title: '.s-item__title',
      price: '.s-item__price',
      url: '.s-item__link',
      container: '.s-item'
    },
    headers: {
      ...baseHeaders,
      'User-Agent': getRandomUserAgent(),
    },
    rateLimitDelay: 2500,
  },
  {
    name: 'Walmart',
    searchUrl: 'https://www.walmart.com/search?q={product}',
    selectors: {
      title: '[data-testid="product-title"]',
      price: '[data-testid="price-current"]',
      url: 'a[href*="/ip/"]',
      container: '[data-testid="product-item"]'
    },
    headers: {
      ...baseHeaders,
      'User-Agent': getRandomUserAgent(),
    },
    rateLimitDelay: 3000,
  },
  {
    name: 'Target',
    searchUrl: 'https://www.target.com/s?searchTerm={product}',
    selectors: {
      title: '[data-test="product-title"]',
      price: '[data-test="product-price"]',
      url: 'a[href*="/p/"]',
      container: '[data-test="product-card"]'
    },
    headers: {
      ...baseHeaders,
      'User-Agent': getRandomUserAgent(),
    },
    rateLimitDelay: 3500,
  },
  {
    name: 'Best Buy',
    searchUrl: 'https://www.bestbuy.com/site/searchpage.jsp?st={product}',
    selectors: {
      title: '.sku-title a',
      price: '.pricing-current-price',
      url: '.sku-title a',
      container: '.sku-item'
    },
    headers: {
      ...baseHeaders,
      'User-Agent': getRandomUserAgent(),
    },
    rateLimitDelay: 3000,
  },
];

// Google search configuration for general web results
export const googleSearchConfig = {
  name: 'Google Search',
  searchUrl: 'https://www.google.com/search?q={product}',
  selectors: {
    title: 'h3',
    price: '.IsqQVc.N7dB9f',
    url: 'a[href]',
    container: '.g'
  },
  headers: {
    ...baseHeaders,
    'User-Agent': getRandomUserAgent(),
  },
  rateLimitDelay: 2000,
};