import React from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";
import Navbar from "../components/Navbar";

function Dashboard({ user, onLogout }) {
  const getRoleMessage = (role) => {
    switch (role) {
      case "Investor":
        return "Explore insights and manage your investment portfolio.";
      case "Financial Advisor":
        return "Guide your clients with data-backed financial decisions.";
      case "Admin":
        return "Manage users, roles, and platform operations.";
      case "Data Analyst":
        return "Analyze performance trends and insights.";
      default:
        return "Your personalized investment dashboard.";
    }
  };

  return (
    <>
      <Navbar user={user} />

      {/* HERO SECTION WITH OVERLAY */}
      <div className="hero-section">

        <h1 className="hero-title">
          Welcome back, <span>{user?.username || "User"}</span> 
        </h1>

        <p className="hero-subtext">{getRoleMessage(user?.role)}</p>

        {/* Buttons */}
        <div className="dashboard-buttons">
          <Link to="/portfolio">
            <button className="btn-primary">📈 Portfolio Overview</button>
          </Link>

          <Link to="/add-fund">
            <button className="btn-primary">💰 Add New Fund</button>
          </Link>

          <Link to="/reports">
            <button className="btn-primary">📊 Reports</button>
          </Link>
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="cards-section">
        <div className="card-grid">

          <div className="card">
            <h3 className="card-title">Total AUM</h3>
            <p className="value">₹ 12,34,567</p>
            <p className="desc">Across all your investments</p>
          </div>

          <div className="card">
            <h3 className="card-title">Top Performing Fund</h3>
            <p className="value">Alpha Growth Fund</p>
            <p className="positive">+18.2% YTD</p>
          </div>

          <div className="card">
            <h3 className="card-title">Portfolio Alerts</h3>
            <p className="warning">3 portfolios need rebalancing</p>
          </div>

        </div>
      </div>

      {/* LOGOUT BUTTON AT BOTTOM */}
      <div className="logout-container">
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
      </div>
    </>
  );
}

export default Dashboard;
