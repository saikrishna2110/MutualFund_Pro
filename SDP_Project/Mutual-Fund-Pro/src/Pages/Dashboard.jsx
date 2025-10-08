import React from "react";
import "../App.css";

function Dashboard({ user, onLogout }) {
  const handlePortfolioOverview = () => {
    alert("📈 Opening Portfolio Overview...");
  };

  const handleAddNewFund = () => {
    alert("💰 Redirecting to Add New Fund page...");
  };

  const handleReports = () => {
    alert("📊 Generating Reports...");
  };

  // Add emoji based on role
  const getRoleEmoji = (role) => {
    switch (role) {
      case "Investor":
        return "Ready to explore your investments and grow your portfolio💼";
      case "Financial Advisor":
        return "Guide your clients toward smarter, more profitable investment choices📊";
      case "Admin":
        return "Manage users, monitor activity, and keep everything running smoothly🛠️";
      case "Data Analyst":
        return "Dive into the data and uncover powerful investment insights🧠";
      default:
        return "👋";
    }
  };

  return (
    <div className="dashboard-container">
      <h1>
       Welcome back, {getRoleEmoji(user?.role)}  <span className="username">{user?.name || ""}</span>!
      </h1>
      <p>Manage and track your mutual fund investments efficiently 🌟</p>

      <div className="dashboard-buttons">
        <button onClick={handlePortfolioOverview}>📈 Portfolio Overview</button>
        <button onClick={handleAddNewFund}>💰 Add New Fund</button>
        <button onClick={handleReports}>📊 Reports</button>
      </div>

      <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
    </div>
  );
}

export default Dashboard;
