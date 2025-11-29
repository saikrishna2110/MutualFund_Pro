import React, { useState } from "react";
import { Link } from "react-router-dom";

function AddFund({ user }) {
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

  const [fundName, setFundName] = useState("");
  const [investment, setInvestment] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`✅ Successfully added "${fundName}" with ₹${investment} investment in ${category}!`);
  };

  return (
    <div className="dashboard-container">
      <h1>💰 Add a New Fund</h1>
      <p>Enter fund details to add it to your portfolio.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.9)",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "450px",
          margin: "30px auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <input
          type="text"
          placeholder="Fund Name"
          value={fundName}
          onChange={(e) => setFundName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />
        <input
          type="number"
          placeholder="Investment Amount (₹)"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        >
          <option value="">Select Fund Category</option>
          <option value="Equity">Equity Fund</option>
          <option value="Debt">Debt Fund</option>
          <option value="Hybrid">Hybrid Fund</option>
        </select>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ➕ Add Fund
        </button>
      </form>

      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      <Link to={getDashboardRoute(user?.role)}>
        <button className="logout-btn" style={{ marginTop: "20px" }}>
          ⬅️ Back to Dashboard
        </button>
      </Link>
    </div>
  );
}

export default AddFund;
