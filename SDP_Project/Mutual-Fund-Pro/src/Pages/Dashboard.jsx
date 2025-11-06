import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

function Dashboard({ user, onLogout }) {
  // Role-based personalized message
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
        return "👋 Welcome back!";
    }
  };

  return (
    <>
      {/* ✅ Navbar only for dashboard */}
      <Navbar user={user} />

      {/* ✅ Dashboard main content */}
      <div className="dashboard-container" style={{ marginTop: "100px" }}>
        <h1>
          Welcome back,{" "}
          <span className="username">{user?.username || "User"}</span> —{" "}
          {getRoleEmoji(user?.role)}
        </h1>
        <p>Manage and track your mutual fund investments efficiently </p>

        {/* ✅ Dashboard Buttons */}
        <div className="dashboard-buttons">
          <Link to="/portfolio">
            <button>📈 Portfolio Overview</button>
          </Link>
          <Link to="/add-fund">
            <button>💰 Add New Fund</button>
          </Link>
          <Link to="/reports">
            <button>📊 Reports</button>
          </Link>
        </div>

        {/* ✅ Logout */}
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </>
  );
}

export default Dashboard;
