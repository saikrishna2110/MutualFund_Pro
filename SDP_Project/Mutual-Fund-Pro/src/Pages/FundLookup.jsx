import React from 'react';
import MutualFundLookup from '../components/MutualFundLookup';

const FundLookup = ({ user, onLogout }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Mutual Fund Lookup Tool
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '18px',
            margin: 0
          }}>
            Search and explore mutual fund details with real-time data
          </p>
        </div>

        {/* Mutual Fund Lookup Component */}
        <MutualFundLookup />

        {/* Additional Info */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px'
        }}>
          <p>
            💡 <strong>Pro Tip:</strong> Use scheme codes like <code style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>100122</code> (HDFC Top 100),
            <code style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              marginLeft: '4px'
            }}>100481</code> (ICICI Bluechip), or
            <code style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              marginLeft: '4px'
            }}>100837</code> (SBI Small Cap)
          </p>
          <p style={{ marginTop: '10px' }}>
            🔗 <strong>Data Source:</strong> Connected to Mutual Fund Pro Backend API at <code style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>http://localhost:5000/api</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundLookup;
