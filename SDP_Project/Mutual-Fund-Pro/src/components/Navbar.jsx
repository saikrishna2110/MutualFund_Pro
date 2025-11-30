import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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

  // Function to get role-specific navigation items
  const getNavItems = (role) => {
    switch (role) {
      case "Investor":
        return [
          // { path: "/fund-lookup", label: "Fund Lookup" }, // Temporarily commented out
          { path: "/add-fund", label: "Add Fund" },
          { path: "/reports", label: "Reports" }
        ];
      case "Admin":
        return [
          // { path: "/fund-lookup", label: "Fund Lookup" }, // Temporarily commented out
          { path: "/user-management", label: "Users" },
          { path: "/system-reports", label: "Reports" },
          { path: "/platform-settings", label: "Settings" }
        ];
      case "Financial Advisor":
        return [
          // { path: "/fund-lookup", label: "Fund Lookup" }, // Temporarily commented out
          { path: "/client-portfolio", label: "Clients" },
          { path: "/market-analysis", label: "Analysis" },
          { path: "/recommendations", label: "Recommendations" }
        ];
      case "Data Analyst":
        return [
          // { path: "/fund-lookup", label: "Fund Lookup" }, // Temporarily commented out
          { path: "/performance-analytics", label: "Analytics" },
          { path: "/trend-analysis", label: "Trends" },
          { path: "/data-visualization", label: "Visualization" }
        ];
      default:
        return [];
    }
  };


  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <h2 className="navbar-logo">💹 MutualFund Pro</h2>
        </div>

        <div className="navbar-right">
          {/* ✅ Dashboard link */}
          <Link to={getDashboardRoute(user?.role)} className="nav-link">
            Dashboard
          </Link>

          {/* Role-specific navigation items */}
          {getNavItems(user?.role).map((item, index) => (
            <Link key={index} to={item.path} className="nav-link">
              {item.label}
            </Link>
          ))}

          {/* ✅ Terms & Conditions popup trigger */}
          <button className="nav-link terms-btn" onClick={handleOpen}>
            Terms & Conditions
          </button>

          {/* ✅ Username display before profile icon */}
          <span className="username-display">{user?.username || "Guest"}</span>

          <div className="profile-section">
            <span className="profile-icon">👤</span>
          </div>
        </div>
      </nav>

      {/* ✅ Terms & Conditions Popup */}
      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📜 Terms & Conditions</h2>
            <p>
              Welcome to MutualFund Pro! By using this platform, you agree to our
              terms outlined below:
            </p>
            <ul>
              <li>All investment data displayed is for informational purposes only.</li>
              <li>Users are responsible for maintaining the confidentiality of their credentials.</li>
              <li>We are not liable for financial losses due to market fluctuations.</li>
              <li>Personal data is handled securely and not shared with third parties.</li>
              <li>By continuing to use this service, you consent to periodic updates and feature changes.</li>
            </ul>
            <button className="close-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
