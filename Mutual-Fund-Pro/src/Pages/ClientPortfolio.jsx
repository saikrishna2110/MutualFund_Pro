import React, { useState } from "react";
import { Link } from "react-router-dom";

function ClientPortfolio({ user }) {
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

  const [selectedClient, setSelectedClient] = useState(null);

  const clients = [
    {
      id: 1,
      name: "Sai Krishna",
      email: "saikrishna@gmail.com",
      riskProfile: "Moderate",
      totalValue: 2500000,
      monthlyReturn: 2.4,
      lastContact: "2025-11-15",
      funds: [
        { name: "Axis Bluechip Fund", amount: 1000000, returns: 12.5 },
        { name: "HDFC Balanced Fund", amount: 800000, returns: 8.3 },
        { name: "ICICI Pru Savings", amount: 700000, returns: 6.2 }
      ]
    },
    {
      id: 2,
      name: "Vijay Veekas",
      email: "v.veekas@gmail.com",
      riskProfile: "Conservative",
      totalValue: 1800000,
      monthlyReturn: 1.8,
      lastContact: "2025-11-12",
      funds: [
        { name: "SBI Magnum Tax Saver", amount: 800000, returns: 9.1 },
        { name: "Kotak Savings Fund", amount: 1000000, returns: 5.8 }
      ]
    },
    {
      id: 3,
      name: "Teja Thrishank",
      email: "teja@gmail.com",
      riskProfile: "Aggressive",
      totalValue: 3200000,
      monthlyReturn: 3.2,
      lastContact: "2025-11-14",
      funds: [
        { name: "Mirae Asset Emerging Bluechip", amount: 1500000, returns: 15.7 },
        { name: "Nippon India Small Cap", amount: 1200000, returns: 18.4 },
        { name: "Franklin India Prima Plus", amount: 500000, returns: 11.2 }
      ]
    },
    {
      id: 4,
      name: "Dilip Sai",
      email: "dilipsai@gmail.com",
      riskProfile: "Moderate",
      totalValue: 950000,
      monthlyReturn: -0.5,
      lastContact: "2025-11-10",
      funds: [
        { name: "UTI Nifty Index Fund", amount: 600000, returns: -2.1 },
        { name: "DSP BlackRock Savings", amount: 350000, returns: 4.8 }
      ]
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Conservative": return "#10b981";
      case "Moderate": return "#f59e0b";
      case "Aggressive": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalAUM = clients.reduce((sum, client) => sum + client.totalValue, 0);
  const avgReturn = clients.reduce((sum, client) => sum + client.monthlyReturn, 0) / clients.length;

  return (
    <div className="dashboard-container">
      <h1>👥 Client Portfolio Management</h1>
      <p>Monitor and manage your clients' investment portfolios with detailed analytics and insights.</p>

      {/* Portfolio Overview */}
      <div className="portfolio-overview">
        <div className="overview-card">
          <h3>Total AUM</h3>
          <p className="overview-value">{formatCurrency(totalAUM)}</p>
          <p className="overview-label">Across {clients.length} clients</p>
        </div>
        <div className="overview-card">
          <h3>Average Monthly Return</h3>
          <p className={`overview-value ${avgReturn >= 0 ? 'positive' : 'negative'}`}>
            {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(1)}%
          </p>
          <p className="overview-label">Portfolio performance</p>
        </div>
        <div className="overview-card">
          <h3>Active Clients</h3>
          <p className="overview-value">{clients.length}</p>
          <p className="overview-label">Under management</p>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="clients-grid">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`client-card ${selectedClient === client.id ? 'selected' : ''}`}
            onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
          >
            <div className="client-header">
              <div className="client-avatar">
                {client.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="client-info">
                <h3 className="client-name">{client.name}</h3>
                <p className="client-email">{client.email}</p>
              </div>
              <span
                className="risk-badge"
                style={{ backgroundColor: getRiskColor(client.riskProfile) }}
              >
                {client.riskProfile}
              </span>
            </div>

            <div className="client-stats">
              <div className="stat-item">
                <span className="stat-label">Portfolio Value</span>
                <span className="stat-value">{formatCurrency(client.totalValue)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Return</span>
                <span className={`stat-value ${client.monthlyReturn >= 0 ? 'positive' : 'negative'}`}>
                  {client.monthlyReturn >= 0 ? '+' : ''}{client.monthlyReturn}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Contact</span>
                <span className="stat-value">{client.lastContact}</span>
              </div>
            </div>

            {selectedClient === client.id && (
              <div className="client-details">
                <h4>Investment Breakdown</h4>
                <div className="funds-list">
                  {client.funds.map((fund, index) => (
                    <div key={index} className="fund-item">
                      <span className="fund-name">{fund.name}</span>
                      <span className="fund-amount">{formatCurrency(fund.amount)}</span>
                      <span className={`fund-return ${fund.returns >= 0 ? 'positive' : 'negative'}`}>
                        {fund.returns >= 0 ? '+' : ''}{fund.returns}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="client-actions">
                  <button className="action-btn">📞 Contact Client</button>
                  <button className="action-btn">📊 View Details</button>
                  <button className="action-btn">💡 Get Recommendations</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="generate-report-btn">➕ Add New Client</button>
        <button className="generate-report-btn">📧 Send Portfolio Updates</button>
        <button className="generate-report-btn">📈 Generate Performance Report</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default ClientPortfolio;
