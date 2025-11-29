import React, { useState } from "react";
import { Link } from "react-router-dom";

function UserManagement({ user }) {
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

  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Investor", status: "Active", joinDate: "2024-01-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Financial Advisor", status: "Active", joinDate: "2024-02-20" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Data Analyst", status: "Inactive", joinDate: "2024-03-10" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Active", joinDate: "2024-01-05" },
    { id: 5, name: "Eve Wilson", email: "eve@example.com", role: "Investor", status: "Active", joinDate: "2024-04-12" },
    { id: 6, name: "Frank Miller", email: "frank@example.com", role: "Financial Advisor", status: "Active", joinDate: "2024-02-28" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "#ef4444";
      case "Financial Advisor": return "#f59e0b";
      case "Data Analyst": return "#8b5cf6";
      case "Investor": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "#10b981" : "#ef4444";
  };

  return (
    <div className="dashboard-container">
      <h1>👥 User Management</h1>
      <p>Manage users, roles, and permissions across the platform.</p>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-results">Found {filteredUsers.length} users</span>
      </div>

      {/* User Statistics */}
      <div className="user-stats-grid">
        <div className="stat-card">
          <h3 className="stat-number">{users.length}</h3>
          <p className="stat-label">Total Users</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{users.filter(u => u.status === "Active").length}</h3>
          <p className="stat-label">Active Users</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{users.filter(u => u.role === "Investor").length}</h3>
          <p className="stat-label">Investors</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{users.filter(u => u.role === "Admin").length}</h3>
          <p className="stat-label">Admins</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="user-row">
                <td className="user-cell user-name">
                  <div className="user-avatar">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {user.name}
                </td>
                <td className="user-cell">{user.email}</td>
                <td className="user-cell">
                  <span
                    className="role-badge"
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="user-cell">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="user-cell">{user.joinDate}</td>
                <td className="user-cell actions-cell">
                  <button className="action-btn edit-btn">Edit</button>
                  <button className={`action-btn ${user.status === 'Active' ? 'deactivate-btn' : 'activate-btn'}`}>
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="generate-report-btn">Add New User</button>
        <button className="generate-report-btn">Export User Data</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default UserManagement;
