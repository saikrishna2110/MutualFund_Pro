import React from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";
import Navbar from "../components/Navbar";

function DataAnalystDashboard({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} />

      {/* HERO SECTION WITH OVERLAY */}
      <div className="hero-section">
        <h1 className="hero-title">
          Analytics Hub, <span>{user?.username || "Analyst"}</span>
        </h1>

        <p className="hero-subtext">
          Analyze performance trends, generate insights, and drive data-informed decisions.
        </p>

        {/* Buttons */}
        <div className="dashboard-buttons">
          <Link to="/performance-analytics">
            <button className="btn-primary">📊 Performance Analytics</button>
          </Link>

          <Link to="/trend-analysis">
            <button className="btn-primary">📈 Trend Analysis</button>
          </Link>

          <Link to="/data-visualization">
            <button className="btn-primary">📉 Data Visualization</button>
          </Link>
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="cards-section">
        <div className="card-grid">
          <div className="card">
            <h3 className="card-title">Data Points Processed</h3>
            <p className="value">2.4M</p>
            <p className="desc">This month</p>
          </div>

          <div className="card">
            <h3 className="card-title">Market Volatility Index</h3>
            <p className="value">18.5</p>
            <p className="warning">High volatility detected</p>
          </div>

          <div className="card">
            <h3 className="card-title">Predictive Accuracy</h3>
            <p className="value">94.2%</p>
            <p className="positive">Model performance</p>
          </div>

          <div className="card">
            <h3 className="card-title">Active Dashboards</h3>
            <p className="value">23</p>
            <p className="desc">Real-time monitoring</p>
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

export default DataAnalystDashboard;
