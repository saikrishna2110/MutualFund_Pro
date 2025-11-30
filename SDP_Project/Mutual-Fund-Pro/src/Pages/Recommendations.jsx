import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllRecommendations,
  getInvestors,
  createRecommendation,
  updateRecommendationStatus,
  getRecommendationStats,
  initializeSampleData
} from "../services/recommendationService";

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
  const [recommendations, setRecommendations] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, implemented: 0, highPriority: 0 });

  // New recommendation form state
  const [newRecommendation, setNewRecommendation] = useState({
    investorId: "",
    investorUsername: "",
    investorName: "",
    category: "",
    recommendation: "",
    expectedReturn: "",
    riskLevel: "",
    timeframe: "",
    priority: "Medium",
    reasoning: ""
  });

  // Load data on component mount
  useEffect(() => {
    initializeSampleData(); // Initialize with sample data if empty
    loadRecommendations();
    loadInvestors();
  }, []);

  const loadRecommendations = () => {
    const allRecommendations = getAllRecommendations();
    setRecommendations(allRecommendations);
    const recommendationStats = getRecommendationStats(user?.username);
    setStats(recommendationStats);
  };

  const loadInvestors = () => {
    const investorsList = getInvestors();
    setInvestors(investorsList);
  };

  const handleCreateRecommendation = async (e) => {
    e.preventDefault();

    if (!newRecommendation.investorId || !newRecommendation.category || !newRecommendation.recommendation) {
      alert("Please fill in all required fields");
      return;
    }

    const recommendationData = {
      ...newRecommendation,
      advisorUsername: user?.username,
      advisorName: user?.username // In real app, this would be the advisor's display name
    };

    console.log('Creating recommendation for:', newRecommendation.investorUsername);
    console.log('Full recommendation data:', recommendationData);

    const result = createRecommendation(recommendationData);

    if (result.success) {
      alert("Recommendation created successfully!");
      setNewRecommendation({
        investorId: "",
        investorUsername: "",
        investorName: "",
        category: "",
        recommendation: "",
        expectedReturn: "",
        riskLevel: "",
        timeframe: "",
        priority: "Medium",
        reasoning: ""
      });
      setShowCreateForm(false);
      loadRecommendations(); // Reload the list
    } else {
      alert("Error creating recommendation: " + result.error);
    }
  };

  const handleInvestorSelect = (investorId) => {
    const selectedInvestor = investors.find(inv => inv.id === parseInt(investorId));
    if (selectedInvestor) {
      setNewRecommendation({
        ...newRecommendation,
        investorId: investorId,
        investorUsername: selectedInvestor.username,
        investorName: selectedInvestor.name,
        riskLevel: selectedInvestor.riskProfile === "Aggressive" ? "High" :
                  selectedInvestor.riskProfile === "Conservative" ? "Low" : "Medium"
      });
    }
  };

  const handleStatusUpdate = (recommendationId, newStatus) => {
    updateRecommendationStatus(recommendationId, newStatus);
    loadRecommendations(); // Reload to reflect changes
  };

  // Mock recommendations data - in real app, this would come from API
  const mockRecommendations = [
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
    ? mockRecommendations
    : mockRecommendations.filter(rec => rec.category.toLowerCase().includes(selectedCategory.toLowerCase()));

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

  const categories = ["all", ...new Set(mockRecommendations.map(rec => rec.category))];

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

      {/* Create New Recommendation Button */}
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.background = "#1d4ed8"}
          onMouseLeave={(e) => e.target.style.background = "#2563eb"}
        >
          {showCreateForm ? "Cancel" : "+ Create Recommendation"}
        </button>
      </div>

      {/* Create Recommendation Form */}
      {showCreateForm && (
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>Create New Recommendation</h3>
          <form onSubmit={handleCreateRecommendation}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                  Select Investor *
                </label>
                <select
                  value={newRecommendation.investorId}
                  onChange={(e) => handleInvestorSelect(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    background: "white"
                  }}
                >
                  <option value="">Choose an investor...</option>
                  {investors.map(investor => (
                    <option key={investor.id} value={investor.id}>
                      {investor.name} ({investor.username}) - {investor.riskProfile}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                  Category *
                </label>
                <select
                  value={newRecommendation.category}
                  onChange={(e) => setNewRecommendation({...newRecommendation, category: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    background: "white"
                  }}
                >
                  <option value="">Select category...</option>
                  <option value="Portfolio Rebalancing">Portfolio Rebalancing</option>
                  <option value="New Investment">New Investment</option>
                  <option value="Sector Rotation">Sector Rotation</option>
                  <option value="Tax Optimization">Tax Optimization</option>
                  <option value="Risk Reduction">Risk Reduction</option>
                  <option value="Dividend Strategy">Dividend Strategy</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                  Expected Return
                </label>
                <input
                  type="text"
                  value={newRecommendation.expectedReturn}
                  onChange={(e) => setNewRecommendation({...newRecommendation, expectedReturn: e.target.value})}
                  placeholder="e.g., 8.5-9.5%"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    background: "white"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                  Timeframe
                </label>
                <input
                  type="text"
                  value={newRecommendation.timeframe}
                  onChange={(e) => setNewRecommendation({...newRecommendation, timeframe: e.target.value})}
                  placeholder="e.g., 3-6 months"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    background: "white"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                Recommendation Details *
              </label>
              <textarea
                value={newRecommendation.recommendation}
                onChange={(e) => setNewRecommendation({...newRecommendation, recommendation: e.target.value})}
                required
                rows="4"
                placeholder="Describe the recommendation in detail..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "white",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                Advisor's Reasoning
              </label>
              <textarea
                value={newRecommendation.reasoning}
                onChange={(e) => setNewRecommendation({...newRecommendation, reasoning: e.target.value})}
                rows="3"
                placeholder="Explain the reasoning behind this recommendation..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "white",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: "10px 20px",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                Create Recommendation
              </button>
            </div>
          </form>
        </div>
      )}

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
                <h3 className="client-name">{rec.investorName || rec.clientName}</h3>
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

              {rec.reasoning && (
                <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
                  <strong>Reasoning:</strong>
                  <p style={{ marginTop: "5px", color: "#64748b", fontSize: "14px" }}>{rec.reasoning}</p>
                </div>
              )}
            </div>

            <div className="recommendation-actions">
              <button
                className="action-btn primary"
                onClick={() => handleStatusUpdate(rec.id, "In Progress")}
                disabled={rec.status === "Implemented"}
              >
                📧 Send to Client
              </button>
              <button
                className="action-btn secondary"
                onClick={() => handleStatusUpdate(rec.id, "Implemented")}
                disabled={rec.status === "Implemented"}
              >
                ✅ Mark Complete
              </button>
              <button className="action-btn secondary">
                📝 Edit
              </button>
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
