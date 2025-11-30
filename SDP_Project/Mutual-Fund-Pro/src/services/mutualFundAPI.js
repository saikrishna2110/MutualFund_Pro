// Mutual Fund API Service
// In production, replace with actual API endpoints

const API_BASE_URL = 'https://api.example-mutualfunds.com'; // Replace with real API

// Mock data for demonstration
const mockMarketData = {
  nifty50: {
    value: 22487.50,
    change: 1.8,
    changePercent: 1.8,
    volume: 245000000
  },
  sensex: {
    value: 74123.45,
    change: 1.6,
    changePercent: 1.6,
    volume: 189000000
  },
  bankNifty: {
    value: 48567.80,
    change: 2.1,
    changePercent: 2.1,
    volume: 156000000
  },
  itSector: {
    value: 35241.60,
    change: 0.9,
    changePercent: 0.9,
    volume: 89000000
  }
};

const mockFundData = [
  {
    name: "HDFC Top 100 Fund",
    nav: 1250.45,
    change: 2.3,
    aum: "45,000 Cr",
    category: "Large Cap"
  },
  {
    name: "ICICI Prudential Bluechip Fund",
    nav: 890.75,
    change: -0.8,
    aum: "32,500 Cr",
    category: "Large Cap"
  },
  {
    name: "SBI Small Cap Fund",
    nav: 2340.90,
    change: 4.1,
    aum: "18,750 Cr",
    category: "Small Cap"
  },
  {
    name: "Axis Midcap Fund",
    nav: 1567.25,
    change: 1.7,
    aum: "15,200 Cr",
    category: "Mid Cap"
  },
  {
    name: "Kotak Corporate Bond Fund",
    nav: 1456.80,
    change: 0.3,
    aum: "22,100 Cr",
    category: "Corporate Bond"
  }
];

const mockHistoricalData = [
  { date: '2024-10-24', nifty: 21700, sensex: 71500, volume: 220000000 },
  { date: '2024-10-25', nifty: 21850, sensex: 71800, volume: 235000000 },
  { date: '2024-10-28', nifty: 21920, sensex: 72100, volume: 248000000 },
  { date: '2024-10-29', nifty: 22100, sensex: 72600, volume: 252000000 },
  { date: '2024-10-30', nifty: 22250, sensex: 73200, volume: 245000000 },
  { date: '2024-10-31', nifty: 22380, sensex: 73800, volume: 238000000 },
  { date: '2024-11-01', nifty: 22487, sensex: 74123, volume: 242000000 }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch real-time market data
export const fetchMarketData = async () => {
  try {
    // Simulate API call delay
    await delay(1000);

    // In production, uncomment this:
    // const response = await fetch(`${API_BASE_URL}/market-data`);
    // if (!response.ok) throw new Error('Failed to fetch market data');
    // return await response.json();

    // Mock response
    return {
      success: true,
      data: mockMarketData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      success: false,
      error: 'Failed to fetch market data',
      data: mockMarketData // Return mock data as fallback
    };
  }
};

// Fetch top performing mutual funds
export const fetchTopFunds = async () => {
  try {
    console.log('📊 Fetching top funds...');

    // Try MFAPI.in first
    const { fetchPopularFunds } = await import('./mfapiService.js');

    try {
      const mfapiResult = await fetchPopularFunds();
      if (mfapiResult.success && mfapiResult.data.length > 0) {
        console.log('✅ Successfully fetched real fund data from MFAPI.in');
        return {
          success: true,
          data: mfapiResult.data,
          timestamp: mfapiResult.timestamp,
          source: mfapiResult.source
        };
      }
    } catch (mfapiError) {
      console.warn('⚠️ MFAPI.in failed, falling back to mock data:', mfapiError.message);
    }

    // Fallback to mock data
    await delay(800);
    console.log('📋 Using mock fund data as fallback');

    return {
      success: true,
      data: mockFundData,
      timestamp: new Date().toISOString(),
      source: 'Mock Data (MFAPI.in fallback)'
    };
  } catch (error) {
    console.error('❌ Error fetching fund data:', error);
    return {
      success: false,
      error: 'Failed to fetch fund data',
      data: mockFundData,
      timestamp: new Date().toISOString(),
      source: 'Mock Data (Error fallback)'
    };
  }
};

// Fetch historical market data for charts
export const fetchHistoricalData = async (period = '1M') => {
  try {
    await delay(1200);

    // In production:
    // const response = await fetch(`${API_BASE_URL}/historical-data?period=${period}`);
    // if (!response.ok) throw new Error('Failed to fetch historical data');
    // return await response.json();

    return {
      success: true,
      data: mockHistoricalData,
      period,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return {
      success: false,
      error: 'Failed to fetch historical data',
      data: mockHistoricalData
    };
  }
};

// Fetch sector-wise performance
export const fetchSectorData = async () => {
  try {
    await delay(900);

    // In production:
    // const response = await fetch(`${API_BASE_URL}/sector-performance`);
    // if (!response.ok) throw new Error('Failed to fetch sector data');
    // return await response.json();

    return {
      success: true,
      data: [
        { sector: 'Technology', performance: 15.2, volume: 'High' },
        { sector: 'Healthcare', performance: 8.7, volume: 'Medium' },
        { sector: 'Banking', performance: -2.1, volume: 'High' },
        { sector: 'Energy', performance: -5.4, volume: 'Low' },
        { sector: 'Consumer', performance: 6.3, volume: 'Medium' }
      ],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching sector data:', error);
    return {
      success: false,
      error: 'Failed to fetch sector data',
      data: []
    };
  }
};

// Get fund performance by category
export const getFundPerformanceByCategory = () => {
  const categories = {
    'Large Cap': mockFundData.filter(fund => fund.category === 'Large Cap'),
    'Mid Cap': mockFundData.filter(fund => fund.category === 'Mid Cap'),
    'Small Cap': mockFundData.filter(fund => fund.category === 'Small Cap'),
    'Corporate Bond': mockFundData.filter(fund => fund.category === 'Corporate Bond')
  };

  return categories;
};

// Calculate market sentiment based on data
export const getMarketSentiment = (marketData) => {
  const avgChange = Object.values(marketData).reduce((sum, index) => sum + index.changePercent, 0) / Object.keys(marketData).length;

  if (avgChange > 2) return { sentiment: 'Bullish', color: '#10b981', icon: '📈' };
  if (avgChange > 0) return { sentiment: 'Neutral', color: '#f59e0b', icon: '➡️' };
  return { sentiment: 'Bearish', color: '#ef4444', icon: '📉' };
};
