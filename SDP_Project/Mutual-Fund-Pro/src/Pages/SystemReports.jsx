import React, { useState } from "react";
import { Link } from "react-router-dom";

function SystemReports({ user }) {
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

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const systemStats = [
    {
      title: "Platform Performance",
      metrics: [
        { label: "Total Users", value: "1,247", change: "+12%", trend: "up" },
        { label: "Active Sessions", value: "892", change: "+8%", trend: "up" },
        { label: "Server Uptime", value: "99.9%", change: "0%", trend: "stable" },
        { label: "Response Time", value: "245ms", change: "-15ms", trend: "down" }
      ]
    },
    {
      title: "Financial Metrics",
      metrics: [
        { label: "Total AUM", value: "₹2.4B", change: "+18%", trend: "up" },
        { label: "Monthly Transactions", value: "15,632", change: "+22%", trend: "up" },
        { label: "Fund Performance", value: "+12.5%", change: "+2.1%", trend: "up" },
        { label: "User Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" }
      ]
    }
  ];

  const reports = [
    {
      id: 1,
      title: "Monthly System Performance Report",
      period: "October 2024",
      status: "Generated",
      downloads: 45,
      size: "2.4 MB"
    },
    {
      id: 2,
      title: "User Activity Analysis",
      period: "Q3 2024",
      status: "Generated",
      downloads: 23,
      size: "1.8 MB"
    },
    {
      id: 3,
      title: "Security Audit Report",
      period: "September 2024",
      status: "Pending",
      downloads: 0,
      size: "N/A"
    },
    {
      id: 4,
      title: "Financial Compliance Report",
      period: "Q2 2024",
      status: "Generated",
      downloads: 67,
      size: "3.2 MB"
    }
  ];

  const getStatusColor = (status) => {
    return status === "Generated" ? "#10b981" : "#f59e0b";
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
      <h1>📊 System Reports</h1>
      <p>Comprehensive analytics and performance reports for platform administration.</p>

      {/* Period Selector */}
      <div className="period-selector">
        <label>Select Period:</label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="period-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* System Statistics */}
      {systemStats.map((section, sectionIndex) => (
        <div key={sectionIndex} className="system-stats-section">
          <h2 className="section-title">{section.title}</h2>
          <div className="metrics-grid">
            {section.metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">{metric.label}</span>
                  <span className={`metric-trend ${metric.trend}`}>
                    {getTrendIcon(metric.trend)} {metric.change}
                  </span>
                </div>
                <div className="metric-value">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Reports Table */}
      <div className="reports-section">
        <h2 className="section-title">Available Reports</h2>
        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr className="table-header">
                <th>Report Title</th>
                <th>Period</th>
                <th>Status</th>
                <th>Downloads</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="report-row">
                  <td className="report-cell report-title">{report.title}</td>
                  <td className="report-cell">{report.period}</td>
                  <td className="report-cell">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(report.status) }}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="report-cell">{report.downloads}</td>
                  <td className="report-cell">{report.size}</td>
                  <td className="report-cell">
                    {report.status === "Generated" ? (
                      <button className="download-btn">📥 Download</button>
                    ) : (
                      <button className="generate-btn">⚙️ Generate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="action-buttons">
        <button className="generate-report-btn">📊 Generate Custom Report</button>
        <button className="generate-report-btn">📧 Send Email Reports</button>
        <button className="generate-report-btn">💾 Export All Data</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default SystemReports;
