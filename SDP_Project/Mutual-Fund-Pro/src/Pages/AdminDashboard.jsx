import React from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";

function AdminDashboard({ user, onLogout }) {
  return (
    <>

      {/* ADMIN PANEL CONTENT STARTING FROM BELOW NAVBAR */}
      <div style={{
        marginTop: '70px',
        padding: '40px 20px',
        textAlign: 'center',
        background: '#f8fafc',
        minHeight: 'calc(100vh - 70px)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '10px'
        }}>
          Admin Panel, <span style={{ color: '#2563eb' }}>{user?.username || "Admin"}</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#64748b',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Manage users, roles, and platform operations efficiently.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '60px'
        }}>
          <Link to="/user-management">
            <button className="btn-primary">👥 User Management</button>
          </Link>

          <Link to="/system-reports">
            <button className="btn-primary">📊 System Reports</button>
          </Link>

          <Link to="/platform-settings">
            <button className="btn-primary">⚙️ Platform Settings</button>
          </Link>
        </div>

      {/* CARDS SECTION */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '22px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 22px rgba(0, 0, 0, 0.07)'
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#0f172a',
              fontWeight: '700',
              marginBottom: '10px'
            }}>Total Users</h3>
            <p style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '5px 0'
            }}>1,234</p>
            <p style={{
              fontSize: '14px',
              color: '#64748b'
            }}>Active platform users</p>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 22px rgba(0, 0, 0, 0.07)'
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#0f172a',
              fontWeight: '700',
              marginBottom: '10px'
            }}>System Health</h3>
            <p style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '5px 0'
            }}>98.5%</p>
            <p style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#16a34a'
            }}>All systems operational</p>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 22px rgba(0, 0, 0, 0.07)'
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#0f172a',
              fontWeight: '700',
              marginBottom: '10px'
            }}>Pending Approvals</h3>
            <p style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '5px 0'
            }}>12</p>
            <p style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#f59e0b'
            }}>Awaiting admin review</p>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 22px rgba(0, 0, 0, 0.07)'
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#0f172a',
              fontWeight: '700',
              marginBottom: '10px'
            }}>Monthly Revenue</h3>
            <p style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '5px 0'
            }}>₹ 2,45,000</p>
            <p style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#16a34a'
            }}>+15% from last month</p>
          </div>
        </div>
      </div>

      {/* LOGOUT BUTTON AT BOTTOM */}
      <div style={{
        textAlign: 'center',
        margin: '20px 0 40px'
      }}>
        <button
          style={{
            background: '#ef4444',
            padding: '12px 28px',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            fontSize: '17px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(239,68,68,0.35)',
            transition: '0.25s'
          }}
          onClick={onLogout}
          onMouseOver={(e) => e.target.style.background = '#dc2626'}
          onMouseOut={(e) => e.target.style.background = '#ef4444'}
        >
          🚪 Logout
        </button>
      </div>
      </div>
    </>
  );
}

export default AdminDashboard;
