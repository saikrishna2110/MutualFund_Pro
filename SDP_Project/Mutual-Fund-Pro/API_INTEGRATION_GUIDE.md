# 🚀 Real API Integration Guide for Financial Advisor Dashboard

## 📋 Overview
This guide shows how to replace mock data with real financial market data in your Financial Advisor Dashboard.

---

## 🎯 Step 1: Choose Your API Provider

### **Recommended APIs for Indian Markets:**

#### **1. Alpha Vantage (Free & Paid)**
```javascript
// Best for: Indian stocks, global indices, forex
const API_KEY = 'YOUR_ALPHA_VANTAGE_KEY';
const BASE_URL = 'https://www.alphavantage.co.in';

// Example endpoints:
const NIFTY_URL = `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=NSE:NIFTY50&apikey=${API_KEY}`;
const SENSEX_URL = `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=BSE:SENSEX&apikey=${API_KEY}`;
```

**Signup:** https://www.alphavantage.co.in/support/#api-key
**Free Tier:** 5 API calls/minute, 500 calls/day
**Cost:** Free for basic use, $49.99/month for premium

#### **2. Yahoo Finance API (Free)**
```javascript
// Best for: Global stocks, indices, crypto
const YAHOO_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI';

// For Indian indices:
const NIFTY_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI';
const SENSEX_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN';
```

**Signup:** No signup required, but rate limited
**Free Tier:** 2,000 requests/hour
**Limitations:** No API key needed, but strict rate limits

#### **3. Financial Modeling Prep (Free & Paid)**
```javascript
// Best for: Comprehensive financial data
const API_KEY = 'YOUR_FMP_KEY';
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Indian market data:
const NIFTY_URL = `${BASE_URL}/historical-price-full/%5ENSEI?apikey=${API_KEY}`;
```

**Signup:** https://financialmodelingprep.com/developer/docs
**Free Tier:** 250 requests/day
**Paid:** From $9.99/month

#### **4. IEX Cloud (Paid)**
```javascript
// Best for: Real-time data, advanced analytics
const API_KEY = 'YOUR_IEX_KEY';
const BASE_URL = 'https://cloud.iexapis.com/stable';

// Indian stocks (limited):
const STOCK_URL = `${BASE_URL}/stock/NIFTY.NS/quote?token=${API_KEY}`;
```

**Signup:** https://iexcloud.io/
**Pricing:** From $9/month

#### **5. Polygon.io (Free & Paid)**
```javascript
// Best for: Real-time and historical data
const API_KEY = 'YOUR_POLYGON_KEY';
const BASE_URL = 'https://api.polygon.io/v2';

// Indian markets (limited coverage):
const AGGREGATES_URL = `${BASE_URL}/aggs/ticker/NIFTY.NS/range/1/day/2023-01-01/2023-12-31?apiKey=${API_KEY}`;
```

**Signup:** https://polygon.io/
**Free Tier:** 5 API calls/minute
**Paid:** From $9/month

---

## 🔑 Step 2: Get API Keys

### **Alpha Vantage Example:**
1. Go to https://www.alphavantage.co.in/support/#api-key
2. Click "Get Free API Key"
3. Fill registration form
4. Check email for API key
5. Verify key at: https://www.alphavantage.co.in/query?function=TIME_SERIES_INTRADAY&symbol=RELIANCE.NS&interval=5min&apikey=YOUR_KEY

### **Environment Variables Setup:**
Create `.env` file in project root:
```env
REACT_APP_ALPHA_VANTAGE_KEY=your_actual_api_key_here
REACT_APP_FINANCIAL_MODELING_PREP_KEY=your_fmp_key_here
REACT_APP_POLYGON_KEY=your_polygon_key_here
```

---

## 🔧 Step 3: Update Your Code

### **Modify `mutualFundAPI.js`:**

```javascript
// Replace mock data with real API calls
const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
const BASE_URL = 'https://www.alphavantage.co.in';

export const fetchMarketData = async () => {
  try {
    console.log('Fetching real market data...');

    // Fetch Nifty 50 data
    const niftyResponse = await fetch(
      `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=NSE:NIFTY50&apikey=${ALPHA_VANTAGE_KEY}`
    );

    if (!niftyResponse.ok) {
      throw new Error(`API Error: ${niftyResponse.status}`);
    }

    const niftyData = await niftyResponse.json();

    // Fetch Sensex data
    const sensexResponse = await fetch(
      `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=BSE:SENSEX&apikey=${ALPHA_VANTAGE_KEY}`
    );

    const sensexData = await sensexResponse.json();

    // Process the data
    const processedData = {
      nifty50: processAlphaVantageData(niftyData),
      sensex: processAlphaVantageData(sensexData),
      bankNifty: await fetchBankNiftyData(),
      itSector: await fetchITSectorData()
    };

    return {
      success: true,
      data: processedData,
      timestamp: new Date().toISOString(),
      source: 'Alpha Vantage API'
    };

  } catch (error) {
    console.error('Real API fetch error:', error);

    // Fallback to mock data on error
    return {
      success: false,
      error: error.message,
      data: mockMarketData, // Your existing mock data
      timestamp: new Date().toISOString(),
      source: 'Mock Data (API Error)'
    };
  }
};

// Helper function to process Alpha Vantage data
const processAlphaVantageData = (apiData) => {
  try {
    const timeSeries = apiData['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('Invalid API response structure');
    }

    const dates = Object.keys(timeSeries).sort().reverse(); // Most recent first
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
      lastUpdated: dates[0]
    };
  } catch (error) {
    console.error('Error processing Alpha Vantage data:', error);
    return mockMarketData.nifty50; // Fallback
  }
};

// Bank Nifty and IT Sector data (you might need different endpoints)
const fetchBankNiftyData = async () => {
  // Similar logic for Bank Nifty
  return mockMarketData.bankNifty; // Placeholder
};

const fetchITSectorData = async () => {
  // Similar logic for IT Sector
  return mockMarketData.itSector; // Placeholder
};
```

### **Update `fetchHistoricalData`:**

```javascript
export const fetchHistoricalData = async (period = '1M') => {
  try {
    const days = period === '1M' ? 30 : period === '3M' ? 90 : 7;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const response = await fetch(
      `${BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=NSE:NIFTY50&outputsize=full&apikey=${ALPHA_VANTAGE_KEY}`
    );

    const data = await response.json();
    const processedData = processHistoricalData(data, days);

    return {
      success: true,
      data: processedData,
      period,
      timestamp: new Date().toISOString(),
      source: 'Alpha Vantage API'
    };

  } catch (error) {
    console.error('Historical data fetch error:', error);
    return {
      success: false,
      error: error.message,
      data: mockHistoricalData,
      source: 'Mock Data (API Error)'
    };
  }
};
```

---

## 🏗️ Step 4: Update Dashboard Component

### **Add Loading States and Error Handling:**

```javascript
// In FinancialAdvisorDashboard.jsx
const [apiStatus, setApiStatus] = useState({
  isLoading: false,
  lastFetch: null,
  error: null,
  dataSource: 'Mock Data'
});

const fetchData = async () => {
  try {
    setApiStatus({ ...apiStatus, isLoading: true, error: null });

    const [marketResult, fundsResult, historicalResult] = await Promise.all([
      fetchMarketData(),
      fetchTopFunds(),
      fetchHistoricalData()
    ]);

    // Update your existing state setters
    if (marketResult.success) {
      setMarketData(marketResult.data);
      setApiStatus(prev => ({ ...prev, dataSource: marketResult.source || 'API' }));
    }

    setApiStatus(prev => ({
      ...prev,
      isLoading: false,
      lastFetch: new Date(),
      error: marketResult.error || null
    }));

  } catch (err) {
    setApiStatus({
      isLoading: false,
      lastFetch: new Date(),
      error: err.message,
      dataSource: 'Error - Using Mock Data'
    });
  }
};
```

### **Add API Status Indicator:**

```javascript
{/* API Status Indicator */}
<div style={{
  position: 'fixed',
  top: '80px',
  right: '20px',
  background: apiStatus.error ? '#fef2f2' : '#f0fdf4',
  border: `1px solid ${apiStatus.error ? '#fecaca' : '#bbf7d0'}`,
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
  zIndex: 100,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    {apiStatus.isLoading ? '🔄' : apiStatus.error ? '⚠️' : '✅'}
    <span>{apiStatus.dataSource}</span>
  </div>
  {apiStatus.lastFetch && (
    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
      Updated: {apiStatus.lastFetch.toLocaleTimeString()}
    </div>
  )}
</div>
```

---

## ⚡ Step 5: Best Practices

### **Rate Limiting:**
```javascript
// Implement request throttling
let lastApiCall = 0;
const API_COOLDOWN = 60000; // 1 minute

const throttleApiCall = async (apiFunction) => {
  const now = Date.now();
  if (now - lastApiCall < API_COOLDOWN) {
    console.log('API call throttled');
    return null;
  }
  lastApiCall = now;
  return apiFunction();
};
```

### **Error Handling:**
```javascript
// Graceful degradation
const safeApiCall = async (apiCall, fallback) => {
  try {
    const result = await apiCall();
    return result.success ? result : fallback;
  } catch (error) {
    console.error('API call failed:', error);
    return fallback;
  }
};
```

### **Caching Strategy:**
```javascript
// Cache API responses
const cache = new Map();

const cachedApiCall = async (key, apiCall, ttl = 300000) => { // 5 minutes
  if (cache.has(key)) {
    const cached = cache.get(key);
    if (Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
  }

  const result = await apiCall();
  cache.set(key, { data: result, timestamp: Date.now() });
  return result;
};
```

---

## 🔒 Step 6: Security Considerations

### **API Key Protection:**
- Never expose API keys in client-side code
- Use environment variables
- Implement server-side proxy for sensitive operations

### **CORS and Headers:**
```javascript
// Add proper headers if needed
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'User-Agent': 'Mutual-Fund-Pro/1.0'
};
```

---

## 📊 Step 7: Testing Your Integration

### **Test Script:**
```javascript
// Create a test file to verify API integration
const testApiIntegration = async () => {
  console.log('Testing API integration...');

  const marketData = await fetchMarketData();
  console.log('Market data result:', marketData);

  const historicalData = await fetchHistoricalData('7D');
  console.log('Historical data result:', historicalData);

  return { marketData, historicalData };
};
```

### **Browser Console Testing:**
1. Open browser developer tools
2. Go to Console tab
3. Run your test functions
4. Check network tab for API calls
5. Verify data structure matches your expectations

---

## 💰 Step 8: Cost Optimization

### **API Usage Monitoring:**
```javascript
// Track API usage
let apiCallCount = 0;
const MAX_CALLS_PER_HOUR = 500; // Adjust based on your plan

const trackApiUsage = () => {
  apiCallCount++;
  if (apiCallCount > MAX_CALLS_PER_HOUR) {
    console.warn('API usage limit approaching');
  }
};
```

### **Data Refresh Strategy:**
- **Real-time data**: Refresh every 1-5 minutes
- **Historical data**: Refresh every 15-30 minutes
- **Static data**: Cache for hours/days

---

## 🚀 Step 9: Deployment Checklist

- [ ] ✅ API keys configured in environment variables
- [ ] ✅ CORS policies configured
- [ ] ✅ Error handling implemented
- [ ] ✅ Loading states added
- [ ] ✅ Rate limiting implemented
- [ ] ✅ Data caching configured
- [ ] ✅ Fallback to mock data working
- [ ] ✅ SSL/HTTPS enabled
- [ ] ✅ Monitoring and logging set up

---

## 🆘 Troubleshooting

### **Common Issues:**

1. **CORS Errors**: Configure server to allow your domain
2. **Rate Limits**: Implement exponential backoff
3. **API Key Issues**: Verify key validity and permissions
4. **Data Format Changes**: Handle API response variations
5. **Network Issues**: Implement retry logic

### **Debug Commands:**
```javascript
// Check API key
console.log('API Key loaded:', !!process.env.REACT_APP_ALPHA_VANTAGE_KEY);

// Test API call
fetchMarketData().then(result => console.log('API Test:', result));

// Check localStorage
console.log('Stored data:', localStorage.getItem('advisor_recommendations'));
```

---

## 📈 Alternative Free APIs

### **For Development/Testing:**
1. **JSONPlaceholder** - Mock API for testing
2. **Mockaroo** - Generate fake financial data
3. **Postman Mock Server** - Create custom mock endpoints

### **Production Alternatives:**
1. **Twelve Data** - Free tier available
2. **Intrinio** - Developer-friendly pricing
3. **Quandl** - Financial data marketplace

---

## 🎯 Final Recommendations

1. **Start with Alpha Vantage** - Great balance of free tier and reliability
2. **Implement proper error handling** - Always have fallback data
3. **Monitor API usage** - Track costs and performance
4. **Use caching** - Reduce API calls and improve performance
5. **Test thoroughly** - Different network conditions and error scenarios

**Ready to integrate real financial data into your dashboard! 🚀📊**
