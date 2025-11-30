import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecommendationsForInvestor, getAllRecommendations, initializeSampleData } from "../services/recommendationService";

function InvestorRecommendations({ user }) {
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

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [recommendations, setRecommendations] = useState([]);

  // Load recommendations for this investor
  useEffect(() => {
    if (user?.username) {
      // Initialize sample data if needed
      initializeSampleData();

      // Try to get recommendations for this user
      let investorRecommendations = getRecommendationsForInvestor(user.username);

      // If no recommendations found, try some common username variations
      if (investorRecommendations.length === 0) {
        // Try lowercase version
        investorRecommendations = getRecommendationsForInvestor(user.username.toLowerCase());

        // If still no recommendations, try the first available sample
        if (investorRecommendations.length === 0) {
          const allRecs = getAllRecommendations();
          if (allRecs.length > 0) {
            // Assign the first recommendation to this user for demo purposes
            investorRecommendations = [allRecs[0]];
          }
        }
      }

      console.log('User:', user.username);
      console.log('All recommendations:', getAllRecommendations());
      console.log('Recommendations found for user:', investorRecommendations);
      setRecommendations(investorRecommendations);
    }
  }, [user]);

  // Use dynamic recommendations or show empty state
  const displayRecommendations = recommendations.length > 0 ? recommendations : [];

  const filteredRecommendations = selectedStatus === "all"
    ? displayRecommendations
    : displayRecommendations.filter(rec => rec.status.toLowerCase() === selectedStatus.toLowerCase());

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

  const stats = {
    total: displayRecommendations.length,
    pending: displayRecommendations.filter(r => r.status === "Pending").length,
    implemented: displayRecommendations.filter(r => r.status === "Implemented").length,
    inProgress: displayRecommendations.filter(r => r.status === "In Progress").length
  };

  return (
    <div className="dashboard-container">
      <h1>💡 Advisor Recommendations</h1>
      <p>Personalized investment recommendations from your financial advisor.</p>

      {/* Debug Info - Remove in production */}
      <div style={{
        background: '#f0f8ff',
        border: '1px solid #b3d9ff',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '20px',
        fontSize: '12px',
        color: '#1e40af'
      }}>
        <strong>Debug Info:</strong><br/>
        User: {user?.username || 'Not logged in'}<br/>
        Total recommendations in system: {getAllRecommendations().length}<br/>
        Recommendations for this user: {recommendations.length}
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: "15px", textAlign: "right", gap: "10px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => {
            initializeSampleData();
            const investorRecommendations = getRecommendationsForInvestor(user?.username || '');
            setRecommendations(investorRecommendations);
            alert(`Refreshed! Found ${investorRecommendations.length} recommendations for ${user?.username}`);
          }}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          🔄 Refresh Recommendations
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('advisor_recommendations');
            setRecommendations([]);
            alert('Cleared all recommendations from storage');
          }}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          🗑️ Clear All Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="recommendations-stats">
        <div className="stat-card">
          <h3 className="stat-number">{stats.total}</h3>
          <p className="stat-label">Total Recommendations</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.pending}</h3>
          <p className="stat-label">Pending Review</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.implemented}</h3>
          <p className="stat-label">Implemented</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.inProgress}</h3>
          <p className="stat-label">In Progress</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="implemented">Implemented</option>
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
                <h3 className="client-name">{rec.advisorName || rec.advisorUsername} - {rec.category}</h3>
                <span className="risk-profile">{new Date(rec.date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
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

              {rec.reasoning && (
                <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
                  <strong>Advisor's Reasoning:</strong>
                  <p style={{ marginTop: "5px", color: "#64748b", fontSize: "14px" }}>{rec.reasoning}</p>
                </div>
              )}
            </div>

            <div className="recommendation-actions">
              {rec.status === "Pending" && (
                <button className="action-btn primary">✅ Accept Recommendation</button>
              )}
              {rec.status === "Pending" && (
                <button className="action-btn secondary">❌ Decline</button>
              )}
              <button className="action-btn secondary">💬 Discuss with Advisor</button>
              <button className="action-btn secondary">📄 View Details</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default InvestorRecommendations;
