import React, { useState } from "react";
import { Link } from "react-router-dom";

function PerformanceAnalytics({ user }) {
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

  const [selectedMetric, setSelectedMetric] = useState("returns");
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");

  const performanceMetrics = [
    {
      fund: "Axis Bluechip Fund",
      returns: { "1M": 2.4, "3M": 8.7, "6M": 15.2, "1Y": 24.8, "3Y": 67.3 },
      volatility: 12.5,
      sharpeRatio: 1.8,
      maxDrawdown: -8.4,
      beta: 0.95,
      alpha: 2.1
    },
    {
      fund: "HDFC Balanced Advantage",
      returns: { "1M": 1.8, "3M": 6.2, "6M": 11.9, "1Y": 18.5, "3Y": 45.7 },
      volatility: 9.8,
      sharpeRatio: 2.1,
      maxDrawdown: -5.2,
      beta: 0.78,
      alpha: 1.5
    },
    {
      fund: "ICICI Prudential Savings",
      returns: { "1M": 0.5, "3M": 1.8, "6M": 3.9, "1Y": 7.2, "3Y": 18.4 },
      volatility: 3.2,
      sharpeRatio: 1.2,
      maxDrawdown: -1.8,
      beta: 0.45,
      alpha: 0.8
    },
    {
      fund: "SBI Small Cap Fund",
      returns: { "1M": -1.2, "3M": 4.5, "6M": 12.8, "1Y": 28.9, "3Y": 89.4 },
      volatility: 18.7,
      sharpeRatio: 1.5,
      maxDrawdown: -15.6,
      beta: 1.25,
      alpha: 3.2
    },
    {
      fund: "Kotak Equity Savings",
      returns: { "1M": 0.9, "3M": 3.1, "6M": 7.8, "1Y": 14.3, "3Y": 32.1 },
      volatility: 6.4,
      sharpeRatio: 2.3,
      maxDrawdown: -3.7,
      beta: 0.62,
      alpha: 1.8
    }
  ];

  const benchmarkData = {
    nifty50: { "1M": 1.2, "3M": 5.8, "6M": 9.4, "1Y": 15.7, "3Y": 42.3 },
    niftyBank: { "1M": 2.1, "3M": 7.3, "6M": 12.1, "1Y": 18.9, "3Y": 55.8 }
  };

  const getMetricDisplay = (metric, value) => {
    if (metric === "returns") {
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    }
    if (metric === "volatility" || metric === "maxDrawdown") {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(2);
  };

  const getMetricColor = (metric, value) => {
    if (metric === "returns" || metric === "sharpeRatio" || metric === "alpha") {
      return value >= 0 ? "#10b981" : "#ef4444";
    }
    if (metric === "volatility" || metric === "maxDrawdown") {
      return value <= 10 ? "#10b981" : value <= 15 ? "#f59e0b" : "#ef4444";
    }
    return "#6b7280";
  };

  const sortedFunds = [...performanceMetrics].sort((a, b) => {
    if (selectedMetric === "returns") {
      return b.returns[selectedPeriod] - a.returns[selectedPeriod];
    }
    return b[selectedMetric] - a[selectedMetric];
  });

  return (
    <div className="dashboard-container">
      <h1>📊 Performance Analytics</h1>
      <p>Deep-dive performance analysis with risk-adjusted metrics, benchmarking, and statistical insights.</p>

      {/* Controls */}
      <div className="analytics-controls">
        <div className="control-group">
          <label>Metric:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-select"
          >
            <option value="returns">Returns</option>
            <option value="volatility">Volatility</option>
            <option value="sharpeRatio">Sharpe Ratio</option>
            <option value="maxDrawdown">Max Drawdown</option>
            <option value="beta">Beta</option>
            <option value="alpha">Alpha</option>
          </select>
        </div>
        <div className="control-group">
          <label>Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
            <option value="3Y">3 Years</option>
          </select>
        </div>
      </div>

      {/* Performance Table */}
      <div className="performance-table-container">
        <table className="performance-table">
          <thead>
            <tr className="table-header">
              <th>Fund Name</th>
              <th>Returns ({selectedPeriod})</th>
              <th>Volatility</th>
              <th>Sharpe Ratio</th>
              <th>Max Drawdown</th>
              <th>Beta</th>
              <th>Alpha</th>
            </tr>
          </thead>
          <tbody>
            {sortedFunds.map((fund, idx) => (
              <tr key={idx} className="performance-row">
                <td className="fund-cell">{fund.fund}</td>
                <td className="metric-cell" style={{ color: getMetricColor("returns", fund.returns[selectedPeriod]) }}>
                  {getMetricDisplay("returns", fund.returns[selectedPeriod])}
                </td>
                <td className="metric-cell" style={{ color: getMetricColor("volatility", fund.volatility) }}>
                  {getMetricDisplay("volatility", fund.volatility)}
                </td>
                <td className="metric-cell" style={{ color: getMetricColor("sharpeRatio", fund.sharpeRatio) }}>
                  {getMetricDisplay("sharpeRatio", fund.sharpeRatio)}
                </td>
                <td className="metric-cell" style={{ color: getMetricColor("maxDrawdown", fund.maxDrawdown) }}>
                  {getMetricDisplay("maxDrawdown", fund.maxDrawdown)}
                </td>
                <td className="metric-cell">{getMetricDisplay("beta", fund.beta)}</td>
                <td className="metric-cell" style={{ color: getMetricColor("alpha", fund.alpha) }}>
                  {getMetricDisplay("alpha", fund.alpha)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Benchmark Comparison */}
      <div className="benchmark-section">
        <h2>📈 Benchmark Comparison</h2>
        <div className="benchmark-grid">
          <div className="benchmark-card">
            <h3>NIFTY 50</h3>
            <p className="benchmark-value">
              {getMetricDisplay("returns", benchmarkData.nifty50[selectedPeriod])}
            </p>
            <p className="benchmark-period">{selectedPeriod} Return</p>
          </div>
          <div className="benchmark-card">
            <h3>NIFTY Bank</h3>
            <p className="benchmark-value">
              {getMetricDisplay("returns", benchmarkData.niftyBank[selectedPeriod])}
            </p>
            <p className="benchmark-period">{selectedPeriod} Return</p>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="risk-analysis-section">
        <h2>⚠️ Risk Analysis Summary</h2>
        <div className="risk-metrics">
          <div className="risk-metric">
            <h4>Average Volatility</h4>
            <p className="risk-value">
              {(performanceMetrics.reduce((sum, fund) => sum + fund.volatility, 0) / performanceMetrics.length).toFixed(1)}%
            </p>
          </div>
          <div className="risk-metric">
            <h4>Best Sharpe Ratio</h4>
            <p className="risk-value">
              {Math.max(...performanceMetrics.map(fund => fund.sharpeRatio)).toFixed(2)}
            </p>
          </div>
          <div className="risk-metric">
            <h4>Worst Drawdown</h4>
            <p className="risk-value">
              {Math.min(...performanceMetrics.map(fund => fund.maxDrawdown)).toFixed(1)}%
            </p>
          </div>
          <div className="risk-metric">
            <h4>Average Beta</h4>
            <p className="risk-value">
              {(performanceMetrics.reduce((sum, fund) => sum + fund.beta, 0) / performanceMetrics.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="generate-report-btn">📊 Generate Detailed Report</button>
        <button className="generate-report-btn">📈 Export Performance Data</button>
        <button className="generate-report-btn">🔄 Update Metrics</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default PerformanceAnalytics;
