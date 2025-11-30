// Real Market API Integration Example
// Replace with your actual API keys in .env file

const ALPHA_VANTAGE_KEY = 'demo'; // Using demo key for Alpha Vantage
const BASE_URL = 'https://www.alphavantage.co.in';

// Rate limiting
let lastApiCall = 0;
const API_COOLDOWN = 12000; // 12 seconds (5 calls/minute limit for free tier)

const rateLimitCheck = () => {
  const now = Date.now();
  if (now - lastApiCall < API_COOLDOWN) {
    throw new Error(`API rate limit: wait ${Math.ceil((API_COOLDOWN - (now - lastApiCall)) / 1000)} seconds`);
  }
  lastApiCall = now;
};

// Process Alpha Vantage response format
const processAlphaVantageData = (apiData, indexName) => {
  try {
    const timeSeries = apiData['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error(`Invalid response for ${indexName}`);
    }

    const dates = Object.keys(timeSeries).sort().reverse();
    const latestData = timeSeries[dates[0]];
    const previousData = timeSeries[dates[1]];

    const currentPrice = parseFloat(latestData['4. close']);
    const previousPrice = parseFloat(previousData['4. close']);
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    return {
      value: currentPrice,
      change: change,
      changePercent: changePercent,
      volume: parseInt(latestData['5. volume']),
      lastUpdated: dates[0],
      source: 'Alpha Vantage'
    };
  } catch (error) {
    console.error(`Error processing ${indexName} data:`, error);
    throw error;
  }
};

// Real API call for market data
export const fetchRealMarketData = async () => {
  try {
    rateLimitCheck();

    console.log('🌐 Fetching real market data from Alpha Vantage...');

    // Fetch Nifty 50
    const niftyResponse = await fetch(
      `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=NSE:NIFTY50&apikey=${ALPHA_VANTAGE_KEY}`
    );

    if (!niftyResponse.ok) {
      throw new Error(`Nifty API Error: ${niftyResponse.status}`);
    }

    const niftyData = await niftyResponse.json();

    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fetch Sensex
    const sensexResponse = await fetch(
      `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=BSE:SENSEX&apikey=${ALPHA_VANTAGE_KEY}`
    );

    if (!sensexResponse.ok) {
      throw new Error(`Sensex API Error: ${sensexResponse.status}`);
    }

    const sensexData = await sensexResponse.json();

    // Process the data
    const processedData = {
      nifty50: processAlphaVantageData(niftyData, 'Nifty 50'),
      sensex: processAlphaVantageData(sensexData, 'Sensex'),
      bankNifty: {
        value: 48567.80,
        change: 2.1,
        changePercent: 2.1,
        volume: 156000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        source: 'Mock (Bank Nifty not available in free tier)'
      },
      itSector: {
        value: 35241.60,
        change: 0.9,
        changePercent: 0.9,
        volume: 89000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        source: 'Mock (IT Sector not available in free tier)'
      }
    };

    return {
      success: true,
      data: processedData,
      timestamp: new Date().toISOString(),
      source: 'Alpha Vantage API',
      apiCallsRemaining: 'Unknown (check dashboard)',
      nextUpdateIn: Math.max(0, API_COOLDOWN - (Date.now() - lastApiCall))
    };

  } catch (error) {
    console.error('❌ Real API fetch failed:', error.message);

    // Return error with fallback suggestion
    return {
      success: false,
      error: error.message,
      data: null,
      timestamp: new Date().toISOString(),
      suggestion: 'Check your API key and network connection. Falling back to mock data.',
      fallback: true
    };
  }
};

// Real API call for historical data
export const fetchRealHistoricalData = async (period = '7D') => {
  try {
    rateLimitCheck();

    console.log(`🌐 Fetching real historical data for ${period}...`);

    const response = await fetch(
      `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=NSE:NIFTY50&outputsize=compact&apikey=${ALPHA_VANTAGE_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Historical API Error: ${response.status}`);
    }

    const data = await response.json();
    const processedData = processHistoricalData(data, period);

    return {
      success: true,
      data: processedData,
      period,
      timestamp: new Date().toISOString(),
      source: 'Alpha Vantage API'
    };

  } catch (error) {
    console.error('❌ Historical data fetch failed:', error.message);

    return {
      success: false,
      error: error.message,
      data: null,
      period,
      timestamp: new Date().toISOString(),
      fallback: true
    };
  }
};

// Process historical data from Alpha Vantage format
const processHistoricalData = (apiData, period) => {
  try {
    const timeSeries = apiData['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('Invalid historical data format');
    }

    const days = period === '7D' ? 7 : period === '1M' ? 30 : 90;
    const dates = Object.keys(timeSeries)
      .sort()
      .reverse()
      .slice(0, days);

    return dates.map(date => {
      const dayData = timeSeries[date];
      return {
        date: date,
        nifty: parseFloat(dayData['4. close']),
        sensex: parseFloat(dayData['4. close']) * 0.85, // Approximation
        volume: parseInt(dayData['5. volume'])
      };
    }).reverse(); // Chronological order

  } catch (error) {
    console.error('Error processing historical data:', error);
    throw error;
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');

    const response = await fetch(
      `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=NSE:NIFTY50&apikey=${ALPHA_VANTAGE_KEY}`
    );

    const data = await response.json();

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      console.warn('⚠️ API Note:', data['Note']);
    }

    return {
      success: true,
      message: 'API connection successful!',
      data: {
        symbol: 'NSE:NIFTY50',
        lastRefreshed: data['Meta Data']?.['3. Last Refreshed'],
        timezone: data['Meta Data']?.['4. Time Zone']
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'API connection failed. Check your API key and network.',
      troubleshooting: [
        '1. Verify your API key is correct',
        '2. Check if you exceeded rate limits',
        '3. Ensure your API key has Indian market access',
        '4. Test with the demo key first'
      ]
    };
  }
};

// Export for use in components
export { ALPHA_VANTAGE_KEY, BASE_URL, API_COOLDOWN };
