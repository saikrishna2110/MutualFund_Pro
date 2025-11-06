import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Portfolio from "./Pages/Portfolio";
import AddFund from "./Pages/AddFund";
import Reports from "./Pages/Reports";

function App() {
  const [user, setUser] = useState(null);

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
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Dashboard */}
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

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
