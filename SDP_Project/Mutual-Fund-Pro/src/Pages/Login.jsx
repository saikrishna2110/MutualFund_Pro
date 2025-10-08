import React, { useState } from 'react';
import '../Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can replace this alert with your backend auth later
    alert(`Logged in as ${role} (${username}) with email: ${email}`);

    // Pass username and role to parent
    onLogin({ username, role });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>MutualFund Pro</h1>
        <p>Sign in to access your investment platform</p>

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select your role</option>
          <option value="Admin">Admin</option>
          <option value="Investor">Investor</option>
          <option value="Financial Advisor">Financial Advisor</option>
          <option value="Data Analyst">Data Analyst</option>
        </select>

        <button type="submit">Sign In</button>

        
      </form>
    </div>
  );
}

export default Login;
