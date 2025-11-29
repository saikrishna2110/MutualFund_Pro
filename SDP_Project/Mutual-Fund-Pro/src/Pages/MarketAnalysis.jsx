import React, { useState } from "react";
import { Link } from "react-router-dom";

function MarketAnalysis({ user }) {
  // Function to get dashboard route based on user role
  const getDashboardRoute = (role) => {
    switch (role) {
      case "Investor":
        return "/investor-dashboard";
      case "Admin":
        return "/admin-dashboard";
      case "Financial Advisor":
        return "/advisor-dashboard";
      case "Data Analyst":
        return "/analyst-dashboard";
      default:
        return "/dashboard";
    }
  };

  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");

  const marketIndices = [
    { name: "NIFTY 50", value: 24567.80, change: 1.24, changePercent: 0.52 },
    { name: "SENSEX", value: 81023.45, change: 234.67, changePercent: 0.29 },
    { name: "NIFTY IT", value: 45231.90, change: -156.23, changePercent: -0.34 },
    { name: "NIFTY Bank", value: 56789.12, change: 456.78, changePercent: 0.81 },
    { name: "NIFTY Pharma", value: 19876.54, change: 123.45, changePercent: 0.63 }
  ];

  const sectorPerformance = [
    { sector: "Technology", performance: 2.4, volume: "High", outlook: "Bullish" },
    { sector: "Healthcare", performance: 1.8, volume: "Medium", outlook: "Neutral" },
    { sector: "Banking", performance: 3.2, volume: "High", outlook: "Bullish" },
    { sector: "Energy", performance: -0.5, volume: "Low", outlook: "Bearish" },
    { sector: "Consumer Goods", performance: 1.1, volume: "Medium", outlook: "Neutral" },
    { sector: "Real Estate", performance: -1.2, volume: "Low", outlook: "Bearish" }
  ];

  const topStocks = [
    { symbol: "RELIANCE", name: "Reliance Industries", price: 2345.60, change: 45.20, changePercent: 1.97 },
    { symbol: "TCS", name: "Tata Consultancy", price: 3456.80, change: -23.40, changePercent: -0.67 },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678.90, change: 34.50, changePercent: 2.10 },
    { symbol: "INFY", name: "Infosys Ltd", price: 1890.25, change: 12.80, changePercent: 0.68 },
    { symbol: "ICICIBANK", name: "ICICI Bank", price: 1234.70, change: -8.90, changePercent: -0.72 }
  ];

  const economicIndicators = [
    { indicator: "GDP Growth", value: "6.8%", trend: "up", lastUpdated: "Q2 2025" },
    { indicator: "Inflation Rate", value: "4.2%", trend: "stable", lastUpdated: "Oct 2025" },
    { indicator: "Interest Rate", value: "6.5%", trend: "down", lastUpdated: "Nov 2025" },
    { indicator: "USD/INR", value: "83.45", trend: "up", lastUpdated: "Today" },
    { indicator: "Crude Oil", value: "$68.50", trend: "stable", lastUpdated: "Today" }
  ];

  const getChangeColor = (change) => {
    return change >= 0 ? "#10b981" : "#ef4444";
  };

  const getOutlookColor = (outlook) => {
    switch (outlook) {
      case "Bullish": return "#10b981";
      case "Neutral": return "#f59e0b";
      case "Bearish": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return "📈";
      case "down": return "📉";
      default: return "➡️";
    }
  };

  return (
    <div className="dashboard-container">
      <h1>📊 Market Analysis</h1>
      <p>Real-time market insights, sector analysis, and economic indicators to inform investment decisions.</p>

      {/* Timeframe Selector */}
      <div className="timeframe-selector">
        <label>Timeframe:</label>
        <div className="timeframe-buttons">
          {["1D", "1W", "1M", "3M", "6M", "1Y"].map((period) => (
            <button
              key={period}
              className={`timeframe-btn ${selectedTimeframe === period ? 'active' : ''}`}
              onClick={() => setSelectedTimeframe(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Market Indices */}
      <div className="market-indices-section">
        <h2>📈 Market Indices</h2>
        <div className="indices-grid">
          {marketIndices.map((index, idx) => (
            <div key={idx} className="index-card">
              <h3 className="index-name">{index.name}</h3>
              <p className="index-value">{index.value.toLocaleString()}</p>
              <p className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent}%)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Performance */}
      <div className="sector-analysis-section">
        <h2>🏭 Sector Performance</h2>
        <div className="sector-table-container">
          <table className="sector-table">
            <thead>
              <tr className="table-header">
                <th>Sector</th>
                <th>Performance</th>
                <th>Volume</th>
                <th>Outlook</th>
              </tr>
            </thead>
            <tbody>
              {sectorPerformance.map((sector, idx) => (
                <tr key={idx} className="sector-row">
                  <td className="sector-cell">{sector.sector}</td>
                  <td className={`sector-cell ${sector.performance >= 0 ? 'positive' : 'negative'}`}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                  </td>
                  <td className="sector-cell">
                    <span className={`volume-badge ${sector.volume.toLowerCase()}`}>
                      {sector.volume}
                    </span>
                  </td>
                  <td className="sector-cell">
                    <span
                      className="outlook-badge"
                      style={{ backgroundColor: getOutlookColor(sector.outlook) }}
                    >
                      {sector.outlook}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Stocks & Economic Indicators */}
      <div className="analysis-grid">
        <div className="analysis-section">
          <h2>⭐ Top Stocks</h2>
          <div className="stocks-list">
            {topStocks.map((stock, idx) => (
              <div key={idx} className="stock-item">
                <div className="stock-info">
                  <span className="stock-symbol">{stock.symbol}</span>
                  <span className="stock-name">{stock.name}</span>
                </div>
                <div className="stock-price">
                  <span className="price-value">₹{stock.price.toFixed(2)}</span>
                  <span className={`price-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analysis-section">
          <h2>🌍 Economic Indicators</h2>
          <div className="indicators-list">
            {economicIndicators.map((indicator, idx) => (
              <div key={idx} className="indicator-item">
                <div className="indicator-info">
                  <span className="indicator-name">{indicator.indicator}</span>
                  <span className="indicator-value">{indicator.value}</span>
                </div>
                <div className="indicator-meta">
                  <span className="indicator-trend">{getTrendIcon(indicator.trend)}</span>
                  <span className="indicator-date">{indicator.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="generate-report-btn">📊 Generate Market Report</button>
        <button className="generate-report-btn">📧 Send Market Update</button>
        <button className="generate-report-btn">💾 Export Analysis</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default MarketAnalysis;
