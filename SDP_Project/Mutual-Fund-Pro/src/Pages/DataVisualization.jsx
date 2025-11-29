import React, { useState } from "react";
import { Link } from "react-router-dom";

function DataVisualization({ user }) {
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

  const [selectedChart, setSelectedChart] = useState("portfolio");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");

  const portfolioData = [
    { category: "Large Cap", value: 45, percentage: 45, color: "#2563eb" },
    { category: "Mid Cap", value: 25, percentage: 25, color: "#10b981" },
    { category: "Small Cap", value: 15, percentage: 15, color: "#f59e0b" },
    { category: "Debt", value: 10, percentage: 10, color: "#ef4444" },
    { category: "Others", value: 5, percentage: 5, color: "#8b5cf6" }
  ];

  const performanceData = [
    { month: "Jan", returns: 2.4, benchmark: 1.8 },
    { month: "Feb", returns: -0.5, benchmark: -0.2 },
    { month: "Mar", returns: 3.2, benchmark: 2.1 },
    { month: "Apr", returns: 1.8, benchmark: 1.5 },
    { month: "May", returns: -1.2, benchmark: -0.8 },
    { month: "Jun", returns: 2.7, benchmark: 2.3 },
    { month: "Jul", returns: 1.9, benchmark: 1.4 },
    { month: "Aug", returns: -0.3, benchmark: 0.1 },
    { month: "Sep", returns: 2.1, benchmark: 1.9 },
    { month: "Oct", returns: 1.5, benchmark: 1.2 },
    { month: "Nov", returns: 2.8, benchmark: 2.4 },
    { month: "Dec", returns: 3.1, benchmark: 2.7 }
  ];

  const riskMetrics = [
    { metric: "Volatility", value: 12.5, benchmark: 15.2, status: "Better" },
    { metric: "Sharpe Ratio", value: 1.8, benchmark: 1.2, status: "Better" },
    { metric: "Max Drawdown", value: -8.4, benchmark: -12.1, status: "Better" },
    { metric: "Beta", value: 0.95, benchmark: 1.0, status: "Better" },
    { metric: "Alpha", value: 2.1, benchmark: 0.8, status: "Better" }
  ];

  const sectorHeatmap = [
    { sector: "Technology", performance: 15.2, volume: "High", sentiment: "Positive" },
    { sector: "Healthcare", performance: 8.7, volume: "Medium", sentiment: "Neutral" },
    { sector: "Banking", performance: -2.1, volume: "High", sentiment: "Negative" },
    { sector: "Energy", performance: -5.4, volume: "Low", sentiment: "Negative" },
    { sector: "Consumer", performance: 6.3, volume: "Medium", sentiment: "Positive" },
    { sector: "Real Estate", performance: -8.9, volume: "Low", sentiment: "Negative" }
  ];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "Positive": return "#10b981";
      case "Neutral": return "#f59e0b";
      case "Negative": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getVolumeColor = (volume) => {
    switch (volume) {
      case "High": return "#10b981";
      case "Medium": return "#f59e0b";
      case "Low": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "portfolio":
        return (
          <div className="chart-container">
            <h2>🥧 Portfolio Allocation</h2>
            <div className="pie-chart-placeholder">
              <div className="pie-legend">
                {portfolioData.map((item, idx) => (
                  <div key={idx} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                    <span className="legend-text">{item.category}: {item.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="pie-chart-visual">
                <div className="pie-chart-circle">
                  {portfolioData.map((item, idx) => (
                    <div
                      key={idx}
                      className="pie-slice"
                      style={{
                        backgroundColor: item.color,
                        transform: `rotate(${idx * 72}deg)`,
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 40 * Math.cos((idx * 72 + 72) * Math.PI / 180)}% ${50 + 40 * Math.sin((idx * 72 + 72) * Math.PI / 180)}%)`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "performance":
        return (
          <div className="chart-container">
            <h2>📈 Performance Comparison</h2>
            <div className="line-chart-placeholder">
              <div className="chart-grid">
                {performanceData.map((data, idx) => (
                  <div key={idx} className="chart-bar">
                    <div className="bar-container">
                      <div
                        className="bar portfolio-bar"
                        style={{ height: `${Math.max(0, data.returns + 5) * 10}px` }}
                        title={`Portfolio: ${data.returns}%`}
                      ></div>
                      <div
                        className="bar benchmark-bar"
                        style={{ height: `${Math.max(0, data.benchmark + 5) * 10}px` }}
                        title={`Benchmark: ${data.benchmark}%`}
                      ></div>
                    </div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color portfolio-color"></div>
                  <span>Portfolio Returns</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color benchmark-color"></div>
                  <span>Benchmark Returns</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "risk":
        return (
          <div className="chart-container">
            <h2>⚠️ Risk Metrics Comparison</h2>
            <div className="risk-chart">
              {riskMetrics.map((metric, idx) => (
                <div key={idx} className="risk-metric-comparison">
                  <h4 className="metric-name">{metric.metric}</h4>
                  <div className="comparison-bars">
                    <div className="comparison-item">
                      <span className="comparison-label">Portfolio</span>
                      <div className="comparison-bar">
                        <div
                          className="bar-fill portfolio-fill"
                          style={{ width: `${Math.min(100, Math.abs(metric.value) * 10)}%` }}
                        ></div>
                        <span className="bar-value">{metric.value}</span>
                      </div>
                    </div>
                    <div className="comparison-item">
                      <span className="comparison-label">Benchmark</span>
                      <div className="comparison-bar">
                        <div
                          className="bar-fill benchmark-fill"
                          style={{ width: `${Math.min(100, Math.abs(metric.benchmark) * 10)}%` }}
                        ></div>
                        <span className="bar-value">{metric.benchmark}</span>
                      </div>
                    </div>
                  </div>
                  <div className="metric-status" style={{ color: metric.status === "Better" ? "#10b981" : "#ef4444" }}>
                    {metric.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "sector":
        return (
          <div className="chart-container">
            <h2>🔥 Sector Heatmap</h2>
            <div className="sector-heatmap">
              <div className="heatmap-header">
                <span>Sector</span>
                <span>Performance</span>
                <span>Volume</span>
                <span>Sentiment</span>
              </div>
              {sectorHeatmap.map((sector, idx) => (
                <div key={idx} className="heatmap-row">
                  <span className="sector-name">{sector.sector}</span>
                  <span className={`performance-value ${sector.performance >= 0 ? 'positive' : 'negative'}`}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                  </span>
                  <span className="volume-indicator" style={{ color: getVolumeColor(sector.volume) }}>
                    {sector.volume}
                  </span>
                  <span className="sentiment-indicator" style={{ color: getSentimentColor(sector.sentiment) }}>
                    {sector.sentiment}
                  </span>
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
      <h1>📊 Data Visualization</h1>
      <p>Interactive charts, graphs, and visual analytics for comprehensive data insights.</p>

      {/* Chart Type Selector */}
      <div className="chart-selector">
        <label>Visualization Type:</label>
        <div className="chart-buttons">
          {[
            { value: "portfolio", label: "Portfolio", icon: "🥧" },
            { value: "performance", label: "Performance", icon: "📈" },
            { value: "risk", label: "Risk Metrics", icon: "⚠️" },
            { value: "sector", label: "Sector Heatmap", icon: "🔥" }
          ].map((option) => (
            <button
              key={option.value}
              className={`chart-btn ${selectedChart === option.value ? 'active' : ''}`}
              onClick={() => setSelectedChart(option.value)}
            >
              <span className="chart-icon">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="visualization-area">
        {renderChart()}
      </div>

      {/* Export Options */}
      <div className="export-options">
        <h2>💾 Export Options</h2>
        <div className="export-buttons">
          <button className="export-btn">📊 Export as PNG</button>
          <button className="export-btn">📄 Export as PDF</button>
          <button className="export-btn">📈 Export Data (CSV)</button>
          <button className="export-btn">🔗 Share Dashboard</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="visualization-stats">
        <div className="stat-box">
          <h3>45%</h3>
          <p>Large Cap Allocation</p>
        </div>
        <div className="stat-box">
          <h3>₹2.4B</h3>
          <p>Total AUM</p>
        </div>
        <div className="stat-box">
          <h3>12.5%</h3>
          <p>Portfolio Volatility</p>
        </div>
        <div className="stat-box">
          <h3>1.8</h3>
          <p>Sharpe Ratio</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="generate-report-btn">🎨 Customize Charts</button>
        <button className="generate-report-btn">🔄 Refresh Data</button>
        <button className="generate-report-btn">📧 Schedule Reports</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default DataVisualization;
