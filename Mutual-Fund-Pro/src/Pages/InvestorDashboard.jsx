import React from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";
import Navbar from "../components/Navbar";

function InvestorDashboard({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} />

      {/* HERO SECTION WITH OVERLAY */}
      <div className="hero-section investor-hero">
        <h1 className="hero-title">
          Welcome back, <span>{user?.username || "Investor"}</span> 
        </h1>

        <p className="hero-subtext">
          Explore insights and manage your investment portfolio with personalized recommendations.
        </p>

        {/* Buttons */}
        <div className="dashboard-buttons">
          <Link to="/portfolio">
            <button className="btn-investor">📈 My Portfolio</button>
          </Link>

          <Link to="/add-fund">
            <button className="btn-investor">💰 Invest More</button>
          </Link>

          <Link to="/reports">
            <button className="btn-investor">📊 Performance Reports</button>
          </Link>
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="cards-section">
        <div className="card-grid">
          <div className="card">
            <h3 className="card-title">Portfolio Value</h3>
            <p className="value">₹ 12,34,567</p>
            <p className="desc">Your total investments</p>
          </div>

          <div className="card">
            <h3 className="card-title">Top Performer</h3>
            <p className="value">Alpha Growth Fund</p>
            <p className="positive">+18.2% YTD</p>
          </div>

          <div className="card">
            <h3 className="card-title">Risk Profile</h3>
            <p className="value">Moderate</p>
            <p className="desc">Based on your investments</p>
          </div>

          <div className="card">
            <h3 className="card-title">Monthly SIP</h3>
            <p className="value">₹ 25,000</p>
            <p className="desc">Auto-invested monthly</p>
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

export default InvestorDashboard;
