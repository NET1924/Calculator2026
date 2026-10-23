// Exchange rate API service
// Using free API: https://api.exchangerate-api.com/v4/latest/USD

interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  lastUpdated: number; // timestamp
}

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Fallback rates (approximate, for offline mode)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  RUB: 92.5,
  GBP: 0.79,
  JPY: 156.5,
  CNY: 7.25,
  CHF: 0.88,
  CAD: 1.35,
  AUD: 1.52,
  TRY: 34.2,
};

export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  // Check cache first
  const cached = getCachedRates();
  if (cached && Date.now() - cached.lastUpdated < CACHE_DURATION) {
    return cached;
  }

  try {
    // Try primary API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const rates: ExchangeRates = {
      base: 'USD',
      date: data.date || new Date().toISOString().split('T')[0],
      rates: data.rates,
      lastUpdated: Date.now(),
    };

    // Cache the result
    cacheRates(rates);
    
    return rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using fallback:', error);
    
    // Return cached rates if available, even if expired
    if (cached) {
      return cached;
    }
    
    // Return fallback rates
    return {
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      rates: FALLBACK_RATES,
      lastUpdated: Date.now(),
    };
  }
};

const getCachedRates = (): ExchangeRates | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to read cache:', error);
  }
  return null;
};

const cacheRates = (rates: ExchangeRates): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
  } catch (error) {
    console.warn('Failed to cache rates:', error);
  }
};

export const clearRatesCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
};

// Convert amount from one currency to another
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number => {
  const fromRate = rates.rates[fromCurrency];
  const toRate = rates.rates[toCurrency];
  
  if (!fromRate || !toRate) {
    return NaN;
  }
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  const result = amountInUSD * toRate;
  
  return result;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

// Get time since last update
export const getTimeSinceUpdate = (lastUpdated: number): string => {
  const diff = Date.now() - lastUpdated;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours} ч ${minutes} мин назад`;
  }
  if (minutes > 0) {
    return `${minutes} мин назад`;
  }
  return 'только что';
};
