import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import InvestorDashboard from "./Pages/InvestorDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import FinancialAdvisorDashboard from "./Pages/FinancialAdvisorDashboard";
import DataAnalystDashboard from "./Pages/DataAnalystDashboard";
import Portfolio from "./Pages/Portfolio";
import AddFund from "./Pages/AddFund";
import Reports from "./Pages/Reports";
import UserManagement from "./Pages/UserManagement";
import SystemReports from "./Pages/SystemReports";
import PlatformSettings from "./Pages/PlatformSettings";
import ClientPortfolio from "./Pages/ClientPortfolio";
import MarketAnalysis from "./Pages/MarketAnalysis";
import Recommendations from "./Pages/Recommendations";
import PerformanceAnalytics from "./Pages/PerformanceAnalytics";
import TrendAnalysis from "./Pages/TrendAnalysis";
import DataVisualization from "./Pages/DataVisualization";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Function to get dashboard route based on user role
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

  // ✅ Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ Save user to localStorage when logged in
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Clear user on logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={getDashboardRoute(user.role)} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Role-specific Dashboards */}
        <Route
          path="/investor-dashboard"
          element={
            user ? (
              <InvestorDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            user ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/advisor-dashboard"
          element={
            user ? (
              <FinancialAdvisorDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/analyst-dashboard"
          element={
            user ? (
              <DataAnalystDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Generic Dashboard (fallback) */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Portfolio */}
        <Route
          path="/portfolio"
          element={
            user ? <Portfolio user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Add Fund */}
        <Route
          path="/add-fund"
          element={
            user ? <AddFund user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            user ? <Reports user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/user-management"
          element={
            user ? <UserManagement user={user} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/system-reports"
          element={
            user ? <SystemReports user={user} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/platform-settings"
          element={
            user ? <PlatformSettings user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Financial Advisor Routes */}
        <Route
          path="/client-portfolio"
          element={
            user ? <ClientPortfolio user={user} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/market-analysis"
          element={
            user ? <MarketAnalysis user={user} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/recommendations"
          element={
            user ? <Recommendations user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Data Analyst Routes */}
        <Route
          path="/performance-analytics"
          element={
            user ? <PerformanceAnalytics user={user} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/trend-analysis"
          element={
            user ? <TrendAnalysis user={user} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/data-visualization"
          element={
            user ? <DataVisualization user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? getDashboardRoute(user.role) : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
