import React from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";
import Navbar from "../components/Navbar";

function FinancialAdvisorDashboard({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} />

      {/* HERO SECTION WITH OVERLAY */}
      <div className="hero-section">
        <h1 className="hero-title">
          Advisor Portal, <span>{user?.username || "Advisor"}</span>
        </h1>

        <p className="hero-subtext">
          Guide your clients with data-backed financial decisions and personalized advice.
        </p>

        {/* Buttons */}
        <div className="dashboard-buttons">
          <Link to="/client-portfolio">
            <button className="btn-primary">👥 Client Portfolios</button>
          </Link>

          <Link to="/market-analysis">
            <button className="btn-primary">📈 Market Analysis</button>
          </Link>

          <Link to="/recommendations">
            <button className="btn-primary">💡 Investment Recommendations</button>
          </Link>
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="cards-section">
        <div className="card-grid">
          <div className="card">
            <h3 className="card-title">Active Clients</h3>
            <p className="value">156</p>
            <p className="desc">Under your guidance</p>
          </div>

          <div className="card">
            <h3 className="card-title">Avg Portfolio Return</h3>
            <p className="value">12.8%</p>
            <p className="positive">Above industry average</p>
          </div>

          <div className="card">
            <h3 className="card-title">Pending Reviews</h3>
            <p className="value">8</p>
            <p className="warning">Client portfolio reviews</p>
          </div>

          <div className="card">
            <h3 className="card-title">Commission This Month</h3>
            <p className="value">₹ 85,000</p>
            <p className="positive">+22% from last month</p>
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

export default FinancialAdvisorDashboard;
