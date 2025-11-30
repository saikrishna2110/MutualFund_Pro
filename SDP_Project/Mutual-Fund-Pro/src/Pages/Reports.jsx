import React from "react";
import { Link } from "react-router-dom";

function Reports({ user }) {
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

  const reports = [
    { title: "Monthly Performance", date: "Oct 2024", status: "Completed" },
    { title: "Quarterly Summary", date: "Q3 2024", status: "Generated" },
    { title: "Year-to-Date Growth", date: "2024", status: "Pending" },
    { title: "Risk Analysis Report", date: "Sep 2024", status: "Completed" },
    { title: "Fund Allocation Insights", date: "Aug 2024", status: "Generated" },
  ];

  const summary = [
    { label: "Total Investment", value: "₹2,78,300", icon: "💰" },
    { label: "Average ROI", value: "8.4%", icon: "📊" },
    { label: "Top Performing Fund", value: "Axis Bluechip", icon: "🏆" },
    { label: "Total Reports Generated", value: "32", icon: "📑" },
  ];

  return (
    <div className="dashboard-container">
      <h1>📈 Reports & Analytics</h1>
      <p>Track and analyze your investment performance using detailed automated insights and summaries.</p>

      {/* ✅ Summary Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {summary.map((item, index) => (
  <div
    key={index}
    style={{
      background: "rgba(255,255,255,0.95)",
      borderRadius: "12px",
      padding: "25px",
      width: "240px",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      color: "#111",
    }}
  >
    <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>{item.icon}</h2>
    <p
      style={{
        fontWeight: "600",
        fontSize: "16px",
        marginBottom: "5px",
        color: "#111", // ✅ darker label text
      }}
    >
      {item.label}
    </p>
    <h3 style={{ fontSize: "18px", color: "#2563eb", fontWeight: "700" }}>
      {item.value}
    </h3>
  </div>
))}

      </div>

      {/* ✅ Reports Table */}
      <h2 className="reports-table-title">Detailed Reports</h2>
      <table
        style={{
          width: "85%",
          margin: "20px auto",
          borderCollapse: "collapse",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr className="table-header">
            <th style={{ padding: "14px" }}>Report Name</th>
            <th style={{ padding: "14px" }}>Period</th>
            <th style={{ padding: "14px" }}>Status</th>
            <th style={{ padding: "14px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#f9f9f9" : "#ffffff",
                transition: "background 0.3s",
              }}
            >
              <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{r.title}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{r.date}</td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  color: r.status === "Pending" ? "orange" : "green",
                  fontWeight: "bold",
                }}
              >
                {r.status}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                <button
                  style={{
                    background: "#5b39f5",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Generate Report Button */}
      <button
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "15px",
          marginTop: "20px",
          fontWeight: "500",
          transition: "background 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.background = "#1e40af")}
        onMouseOut={(e) => (e.target.style.background = "#2563eb")}
      >
        ➕ Generate New Report
      </button>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default Reports;
