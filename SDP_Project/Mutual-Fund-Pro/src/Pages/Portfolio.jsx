import React from "react";
import { Link } from "react-router-dom";

function Portfolio({ user }) {
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

  const funds = [
    { name: "Axis Bluechip Fund", value: "₹1,25,000", growth: "+8.2%" },
    { name: "HDFC Midcap Opportunities", value: "₹87,500", growth: "+6.4%" },
    { name: "ICICI Prudential Value Discovery", value: "₹65,800", growth: "+9.7%" },
    { name: "SBI Small Cap Fund", value: "₹53,200", growth: "+10.3%" },
    { name: "UTI Flexi Cap Fund", value: "₹92,600", growth: "+7.1%" },
  ];

  const summary = [
    { label: "💰 Total Investment", value: "₹4,24,100" },
    { label: "📈 Average Growth", value: "+8.3%" },
    { label: "🏆 Top Performer", value: "SBI Small Cap Fund" },
    { label: "📅 Last Updated", value: "04 Nov 2025" },
  ];

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <h1>📊 Portfolio Overview</h1>
      <p>Get a quick insight into your investment distribution and performance metrics.</p>

      {/* ===== SUMMARY CARDS ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
          justifyContent: "center",
          padding: "0 30px",
          marginBottom: "50px",
        }}
      >
        {summary.map((item, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              color: "#fff",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
            }}
          >
            <h3 style={{ fontSize: "16px", marginBottom: "10px", color: "#cbd5e1" }}>
              {item.label}
            </h3>
            <h2 style={{ color: "#38bdf8", fontWeight: "700", fontSize: "22px" }}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ===== FUND CARDS ===== */}
      <h2 className="section-title">
        💼 Your Mutual Funds
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "0 20px",
        }}
      >
        {funds.map((fund, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              padding: "20px",
              width: "280px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              textAlign: "left",
              color: "#111",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
            }}
          >
            <h3 style={{ marginBottom: "10px", fontWeight: "600" }}>{fund.name}</h3>
            <p style={{ color: "#333", fontSize: "15px", marginBottom: "8px" }}>
              <strong>Current Value:</strong> {fund.value}
            </p>
            <p
              style={{
                color: "#16a34a",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              {fund.growth}
            </p>
          </div>
        ))}
      </div>

      {/* ===== INSIGHTS ===== */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          padding: "25px",
          width: "85%",
          margin: "60px auto 30px",
          textAlign: "left",
          color: "#e2e8f0",
          lineHeight: "1.6",
        }}
      >
        <h2 className="section-title">💡 Investment Insights</h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Small Cap funds are outperforming others with 10%+ growth.</li>
          <li>Consider increasing exposure to Flexi Cap funds for diversity.</li>
          <li>Rebalance your portfolio every 6 months for risk control.</li>
          <li>Your ROI is currently 1.2% above the market average.</li>
          <li>Maintain liquidity by keeping 10% in short-term debt funds.</li>
        </ul>
      </div>

      {/* ===== ACTION BUTTONS ===== */}
      <div style={{ marginBottom: "40px" }}>
        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500",
            marginRight: "15px",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#1e3a8a")}
          onMouseOut={(e) => (e.target.style.background = "#2563eb")}
        >
          ⬇️ Download Report
        </button>

        <Link to={getDashboardRoute(user?.role)}>
          <button
            className="logout-btn"

            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            ⬅️ Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Portfolio;
