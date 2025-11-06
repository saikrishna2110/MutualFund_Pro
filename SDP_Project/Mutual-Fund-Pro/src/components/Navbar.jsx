import React, { useState } from "react";
import "./Navbar.css";

function Navbar({ user }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <h2 className="navbar-logo">💹 MutualFund Pro</h2>
        </div>

        <div className="navbar-right">
          {/* ✅ Dashboard is plain text */}
          <span className="nav-text">Dashboard</span>

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
