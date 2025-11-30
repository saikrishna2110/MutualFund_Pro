import React, { useState } from 'react';
import { mutualFundAPI, handleApiResponse } from '../services/backendAPI';

const MutualFundLookup = () => {
  const [schemeCode, setSchemeCode] = useState('');
  const [fundData, setFundData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();

    if (!schemeCode.trim()) {
      setError('Please enter a scheme code');
      return;
    }

    setLoading(true);
    setError('');
    setFundData(null);

    try {
      const response = await handleApiResponse(mutualFundAPI.getFundByCode(schemeCode.trim()));

      if (response.success) {
        setFundData(response.data);
      } else {
        setError(response.error || 'Failed to fetch fund data');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(amount);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '20px auto',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        🔍 Mutual Fund Lookup
      </h2>

      <form onSubmit={handleLookup} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={schemeCode}
            onChange={(e) => setSchemeCode(e.target.value)}
            placeholder="Enter Scheme Code (e.g., 100122)"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? '🔄 Searching...' : '🔍 Lookup'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {fundData && (
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '20px'
            }}>
              📊
            </div>
            <div>
              <h3 style={{
                margin: '0 0 4px 0',
                color: '#1e293b',
                fontSize: '20px',
                fontWeight: '600'
              }}>
                {fundData.schemeName || 'Unknown Fund'}
              </h3>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px'
              }}>
                Scheme Code: {fundData.schemeCode}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                Latest NAV
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                {formatCurrency(fundData.nav)}
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                Last Updated
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                {formatDate(fundData.navDate || fundData.date)}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {fundData.fundHouse && (
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  Fund House
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {fundData.fundHouse}
                </div>
              </div>
            )}

            {fundData.schemeCategory && (
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  Category
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {fundData.schemeCategory}
                </div>
              </div>
            )}

            {fundData.schemeType && (
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  Type
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {fundData.schemeType}
                </div>
              </div>
            )}
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#ecfdf5',
            border: '1px solid #bbf7d0',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#166534',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              ✅ Data Source
            </div>
            <div style={{
              fontSize: '14px',
              color: '#166534'
            }}>
              Real-time data fetched from Mutual Fund Pro Backend API
            </div>
          </div>
        </div>
      )}

      {!fundData && !loading && !error && (
        <div style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '16px',
          padding: '40px 20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p>Enter a scheme code above to look up mutual fund details</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Try: <code style={{
              background: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>100122</code> (HDFC Top 100)
          </p>
        </div>
      )}
    </div>
  );
};

export default MutualFundLookup;
