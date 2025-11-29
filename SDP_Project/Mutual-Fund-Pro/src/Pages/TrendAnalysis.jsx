import React, { useState } from "react";
import { Link } from "react-router-dom";

function TrendAnalysis({ user }) {
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

  const [selectedTrend, setSelectedTrend] = useState("sector");
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");

  const sectorTrends = [
    { sector: "Technology", trend: "Bullish", strength: 85, momentum: "Strong", prediction: "Uptrend continues" },
    { sector: "Healthcare", trend: "Bullish", strength: 72, momentum: "Moderate", prediction: "Stable growth" },
    { sector: "Banking", trend: "Neutral", strength: 58, momentum: "Weak", prediction: "Sideways movement" },
    { sector: "Energy", trend: "Bearish", strength: 45, momentum: "Weak", prediction: "Downtrend likely" },
    { sector: "Consumer Goods", trend: "Bullish", strength: 68, momentum: "Moderate", prediction: "Gradual uptrend" },
    { sector: "Real Estate", trend: "Bearish", strength: 38, momentum: "Strong", prediction: "Continued decline" }
  ];

  const marketTrends = [
    { indicator: "Market Sentiment", current: "Optimistic", change: "+12%", timeframe: "1M", signal: "Buy" },
    { indicator: "Put/Call Ratio", current: "0.85", change: "-8%", timeframe: "1W", signal: "Buy" },
    { indicator: "VIX Index", current: "18.5", change: "-15%", timeframe: "1M", signal: "Buy" },
    { indicator: "Advance-Decline Line", current: "1,247", change: "+5%", timeframe: "1W", signal: "Buy" },
    { indicator: "New Highs/New Lows", current: "2.3", change: "+25%", timeframe: "1M", signal: "Strong Buy" }
  ];

  const investmentTrends = [
    { category: "Equity Savings", popularity: 92, growth: "+18%", risk: "Low", outlook: "Bullish" },
    { category: "Large Cap Funds", popularity: 88, growth: "+12%", risk: "Medium", outlook: "Neutral" },
    { category: "Mid Cap Funds", popularity: 76, growth: "+8%", risk: "High", outlook: "Bullish" },
    { category: "Small Cap Funds", popularity: 65, growth: "+22%", risk: "Very High", outlook: "Bullish" },
    { category: "Debt Funds", popularity: 58, growth: "-5%", risk: "Low", outlook: "Bearish" },
    { category: "Gold ETFs", popularity: 71, growth: "+15%", risk: "Low", outlook: "Bullish" }
  ];

  const seasonalPatterns = [
    { month: "January", performance: 2.4, pattern: "Strong start", reason: "Year-end bonuses invested" },
    { month: "February", performance: -0.8, pattern: "Correction", reason: "Tax season uncertainty" },
    { month: "March", performance: 3.1, pattern: "End of FY rally", reason: "Corporate results" },
    { month: "April", performance: 1.8, pattern: "New FY optimism", reason: "Budget expectations" },
    { month: "May", performance: -1.2, pattern: "Summer slowdown", reason: "Holiday season" },
    { month: "June", performance: 2.7, pattern: "Monsoon rally", reason: "Agricultural optimism" }
  ];

  const getTrendColor = (trend) => {
    switch (trend) {
      case "Bullish": return "#10b981";
      case "Neutral": return "#f59e0b";
      case "Bearish": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case "Strong Buy": return "#10b981";
      case "Buy": return "#22c55e";
      case "Hold": return "#f59e0b";
      case "Sell": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low": return "#10b981";
      case "Medium": return "#f59e0b";
      case "High": return "#ef4444";
      case "Very High": return "#dc2626";
      default: return "#6b7280";
    }
  };

  const renderTrendContent = () => {
    switch (selectedTrend) {
      case "sector":
        return (
          <div className="trend-content">
            <h2>🏭 Sector Trends Analysis</h2>
            <div className="sector-trends-grid">
              {sectorTrends.map((sector, idx) => (
                <div key={idx} className="sector-trend-card">
                  <div className="sector-header">
                    <h3 className="sector-name">{sector.sector}</h3>
                    <span className="trend-badge" style={{ backgroundColor: getTrendColor(sector.trend) }}>
                      {sector.trend}
                    </span>
                  </div>
                  <div className="sector-metrics">
                    <div className="metric">
                      <span className="metric-label">Strength:</span>
                      <span className="metric-value">{sector.strength}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Momentum:</span>
                      <span className="metric-value">{sector.momentum}</span>
                    </div>
                  </div>
                  <p className="sector-prediction">{sector.prediction}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "market":
        return (
          <div className="trend-content">
            <h2>📊 Market Indicators</h2>
            <div className="market-indicators-table">
              <table className="indicators-table">
                <thead>
                  <tr className="table-header">
                    <th>Indicator</th>
                    <th>Current Value</th>
                    <th>Change</th>
                    <th>Timeframe</th>
                    <th>Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {marketTrends.map((indicator, idx) => (
                    <tr key={idx} className="indicator-row">
                      <td className="indicator-cell">{indicator.indicator}</td>
                      <td className="indicator-cell">{indicator.current}</td>
                      <td className={`indicator-cell ${indicator.change.includes('+') ? 'positive' : 'negative'}`}>
                        {indicator.change}
                      </td>
                      <td className="indicator-cell">{indicator.timeframe}</td>
                      <td className="indicator-cell">
                        <span className="signal-badge" style={{ backgroundColor: getSignalColor(indicator.signal) }}>
                          {indicator.signal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "investment":
        return (
          <div className="trend-content">
            <h2>💰 Investment Trends</h2>
            <div className="investment-trends-grid">
              {investmentTrends.map((trend, idx) => (
                <div key={idx} className="investment-trend-card">
                  <h3 className="category-name">{trend.category}</h3>
                  <div className="trend-metrics">
                    <div className="metric">
                      <span className="metric-label">Popularity:</span>
                      <span className="metric-value">{trend.popularity}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Growth:</span>
                      <span className={`metric-value ${trend.growth.includes('+') ? 'positive' : 'negative'}`}>
                        {trend.growth}
                      </span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Risk:</span>
                      <span className="risk-badge" style={{ backgroundColor: getRiskColor(trend.risk) }}>
                        {trend.risk}
                      </span>
                    </div>
                  </div>
                  <div className="outlook">
                    <span className="outlook-label">Outlook:</span>
                    <span className="outlook-value" style={{ color: getTrendColor(trend.outlook) }}>
                      {trend.outlook}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "seasonal":
        return (
          <div className="trend-content">
            <h2>📅 Seasonal Patterns</h2>
            <div className="seasonal-patterns-grid">
              {seasonalPatterns.map((pattern, idx) => (
                <div key={idx} className="seasonal-card">
                  <h3 className="month-name">{pattern.month}</h3>
                  <div className="pattern-metrics">
                    <div className="performance">
                      <span className="perf-label">Performance:</span>
                      <span className={`perf-value ${pattern.performance >= 0 ? 'positive' : 'negative'}`}>
                        {pattern.performance >= 0 ? '+' : ''}{pattern.performance}%
                      </span>
                    </div>
                    <div className="pattern-type">
                      <span className="pattern-label">Pattern:</span>
                      <span className="pattern-value">{pattern.pattern}</span>
                    </div>
                  </div>
                  <p className="pattern-reason">{pattern.reason}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <h1>📈 Trend Analysis</h1>
      <p>Identify market trends, seasonal patterns, and investment flows using advanced analytics.</p>

      {/* Trend Type Selector */}
      <div className="trend-selector">
        <label>Analysis Type:</label>
        <div className="trend-buttons">
          {[
            { value: "sector", label: "Sector Trends", icon: "🏭" },
            { value: "market", label: "Market Indicators", icon: "📊" },
            { value: "investment", label: "Investment Flows", icon: "💰" },
            { value: "seasonal", label: "Seasonal Patterns", icon: "📅" }
          ].map((option) => (
            <button
              key={option.value}
              className={`trend-btn ${selectedTrend === option.value ? 'active' : ''}`}
              onClick={() => setSelectedTrend(option.value)}
            >
              <span className="trend-icon">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trend Content */}
      {renderTrendContent()}

      {/* Trend Summary */}
      <div className="trend-summary">
        <h2>📋 Trend Summary</h2>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Bullish Trends:</span>
            <span className="stat-value">3 sectors</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Market Signals:</span>
            <span className="stat-value positive">4 Buy, 1 Hold</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Popular Categories:</span>
            <span className="stat-value">Equity Savings (92%)</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Best Month:</span>
            <span className="stat-value">March (+3.1%)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="generate-report-btn">📊 Generate Trend Report</button>
        <button className="generate-report-btn">📈 Export Trend Data</button>
        <button className="generate-report-btn">🔄 Update Analysis</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default TrendAnalysis;
