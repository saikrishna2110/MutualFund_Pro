import React, { useState } from "react";
import { Link } from "react-router-dom";

function Recommendations({ user }) {
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

  const [selectedCategory, setSelectedCategory] = useState("all");

  const recommendations = [
    {
      id: 1,
      clientName: "Sai ",
      riskProfile: "Moderate",
      category: "Portfolio Rebalancing",
      recommendation: "Rebalance portfolio by reducing technology exposure and increasing healthcare allocation",
      expectedReturn: "8.5-9.5%",
      riskLevel: "Medium",
      timeframe: "3-6 months",
      status: "Pending",
      priority: "High"
    },
    {
      id: 2,
      clientName: "Sai Krishna",
      riskProfile: "Conservative",
      category: "New Investment",
      recommendation: "Consider adding HDFC Corporate Bond Fund for stable income generation",
      expectedReturn: "6.0-7.0%",
      riskLevel: "Low",
      timeframe: "1-3 months",
      status: "Implemented",
      priority: "Medium"
    },
    {
      id: 3,
      clientName: "Vijay Veekas",
      riskProfile: "Aggressive",
      category: "Sector Rotation",
      recommendation: "Rotate from banking sector to technology and renewable energy funds",
      expectedReturn: "12.0-15.0%",
      riskLevel: "High",
      timeframe: "1-2 months",
      status: "Pending",
      priority: "High"
    },
    {
      id: 4,
      clientName: "Teja Thrishank",
      riskProfile: "Moderate",
      category: "Tax Optimization",
      recommendation: "Switch to ELSS funds for tax saving and long-term capital appreciation",
      expectedReturn: "10.0-12.0%",
      riskLevel: "Medium",
      timeframe: "Immediate",
      status: "In Progress",
      priority: "Medium"
    },
    {
      id: 5,
      clientName: "Dilip",
      riskProfile: "Conservative",
      category: "Risk Reduction",
      recommendation: "Diversify into gold ETFs and reduce equity exposure to 40% of portfolio",
      expectedReturn: "5.5-6.5%",
      riskLevel: "Low",
      timeframe: "2-4 months",
      status: "Pending",
      priority: "High"
    }
  ];

  const filteredRecommendations = selectedCategory === "all"
    ? recommendations
    : recommendations.filter(rec => rec.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const getStatusColor = (status) => {
    switch (status) {
      case "Implemented": return "#10b981";
      case "In Progress": return "#f59e0b";
      case "Pending": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const categories = ["all", ...new Set(recommendations.map(rec => rec.category))];

  const stats = {
    total: recommendations.length,
    pending: recommendations.filter(r => r.status === "Pending").length,
    implemented: recommendations.filter(r => r.status === "Implemented").length,
    highPriority: recommendations.filter(r => r.priority === "High").length
  };

  return (
    <div className="dashboard-container">
      <h1>💡 Investment Recommendations</h1>
      <p>AI-powered investment recommendations tailored to each client's risk profile and financial goals.</p>

      {/* Statistics Cards */}
      <div className="recommendations-stats">
        <div className="stat-card">
          <h3 className="stat-number">{stats.total}</h3>
          <p className="stat-label">Total Recommendations</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.pending}</h3>
          <p className="stat-label">Pending Actions</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.implemented}</h3>
          <p className="stat-label">Implemented</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.highPriority}</h3>
          <p className="stat-label">High Priority</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-results">Showing {filteredRecommendations.length} recommendations</span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="recommendations-list">
        {filteredRecommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <div className="recommendation-header">
              <div className="client-info">
                <h3 className="client-name">{rec.clientName}</h3>
                <span className="risk-profile">{rec.riskProfile} Risk</span>
              </div>
              <div className="recommendation-meta">
                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(rec.priority) }}>
                  {rec.priority}
                </span>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(rec.status) }}>
                  {rec.status}
                </span>
              </div>
            </div>

            <div className="recommendation-content">
              <h4 className="recommendation-category">{rec.category}</h4>
              <p className="recommendation-text">{rec.recommendation}</p>

              <div className="recommendation-details">
                <div className="detail-item">
                  <span className="detail-label">Expected Return:</span>
                  <span className="detail-value">{rec.expectedReturn}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Risk Level:</span>
                  <span className="detail-value" style={{ color: getRiskColor(rec.riskLevel) }}>
                    {rec.riskLevel}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Timeframe:</span>
                  <span className="detail-value">{rec.timeframe}</span>
                </div>
              </div>
            </div>

            <div className="recommendation-actions">
              <button className="action-btn primary">📧 Send to Client</button>
              <button className="action-btn secondary">📝 Edit</button>
              <button className="action-btn secondary">✅ Mark Complete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="generate-report-btn">🤖 Generate AI Recommendations</button>
        <button className="generate-report-btn">📊 Export Recommendations</button>
        <button className="generate-report-btn">📧 Bulk Email Clients</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default Recommendations;
