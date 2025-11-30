import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";
import {
  fetchMarketData,
  fetchTopFunds,
  fetchHistoricalData,
  getMarketSentiment,
  getFundPerformanceByCategory
} from "../services/mutualFundAPI";
import { fetchPopularFunds as fetchMFAPIFunds, testMfApiConnection } from "../services/mfapiService";

function FinancialAdvisorDashboard({ user, onLogout }) {
  const [marketData, setMarketData] = useState(null);
  const [fundData, setFundData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try MFAPI.in for fund data, fallback to mock data
        let fundsResult;
        try {
          console.log('🎯 Attempting to fetch real MF data from MFAPI.in...');
          const mfapiResult = await fetchMFAPIFunds();
          if (mfapiResult.success && mfapiResult.data.length > 0) {
            fundsResult = mfapiResult;
            console.log('✅ Successfully loaded real MF data from MFAPI.in');
          } else {
            console.log('⚠️ MFAPI.in returned no data, falling back to mock data');
            fundsResult = await fetchTopFunds();
          }
        } catch (mfapiError) {
          console.log('❌ MFAPI.in failed, using mock data:', mfapiError.message);
          fundsResult = await fetchTopFunds();
        }

        const [marketResult, historicalResult] = await Promise.all([
          fetchMarketData(),
          fetchHistoricalData()
        ]);

        if (marketResult.success) {
          setMarketData(marketResult.data);
        }
        if (fundsResult.success) {
          setFundData(fundsResult.data);
        }
        if (historicalResult.success) {
          setHistoricalData(historicalResult.data);
        }

        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to load market data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);


  const marketSentiment = marketData ? getMarketSentiment(marketData) : null;
  const fundCategories = getFundPerformanceByCategory();


  // Detailed Modal Component
  const DetailModal = ({ data, isOpen, onClose }) => {
    if (!isOpen || !data) return null;

    return (
      <div className="detail-modal-overlay" onClick={onClose}>
        <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="detail-modal-close" onClick={onClose}>
            ×
          </button>

          {/* Modal Header */}
          <div className="detail-modal-header">
            <h2 className="detail-modal-title">
              {data.icon} {data.title}
            </h2>
            {data.subtitle && (
              <p className="detail-modal-subtitle">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Modal Content */}
          <div>
            {data.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="detail-modal-section">
                <h3 className="detail-modal-section-title">
                  {section.title}
                </h3>
                <div className="detail-modal-grid">
                  {section.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="detail-modal-item">
                      <span className="detail-modal-label">{detail.label}:</span>
                      <span
                        className="detail-modal-value"
                        style={{ color: detail.color || '#1e293b' }}
                      >
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Insights Section */}
          {data.insights && (
            <div className="detail-modal-insights">
              <h4 className="detail-modal-insights-title">💡 Insights</h4>
              <ul className="detail-modal-insights-list">
                {data.insights.map((insight, index) => (
                  <li key={index} className="detail-modal-insights-item">{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="detail-modal-actions">
            <button className="detail-modal-btn detail-modal-btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="detail-modal-btn detail-modal-btn-primary">
              📊 View Full Chart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Detailed Modal */}
      <DetailModal
        data={selectedPoint}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPoint(null);
        }}
      />


      {/* HERO SECTION WITH OVERLAY */}
      <div className="hero-section">
        <h1 className="hero-title">
          Advisor Portal, <span>{user?.username || "Advisor"}</span>
        </h1>

        <p className="hero-subtext">
          Guide your clients with data-backed financial decisions and personalized advice.
        </p>

        {/* Buttons */}
        <div className="dashboard-buttons">
          <Link to="/client-portfolio">
            <button className="btn-primary">👥 Client Portfolios</button>
          </Link>

          <Link to="/market-analysis">
            <button className="btn-primary">📈 Market Analysis</button>
          </Link>

          <Link to="/recommendations">
            <button className="btn-primary">💡 Investment Recommendations</button>
          </Link>
        </div>
      </div>

      {/* DATA SOURCE INDICATOR */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '15px 20px',
        margin: '20px auto',
        maxWidth: '1200px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>
              {fundData.length > 0 && fundData[0]?.source === 'MFAPI.in' ? '🌐' : '📊'}
            </span>
            <div>
              <h3 style={{ margin: '0', fontSize: '16px', color: '#1e293b' }}>
                Mutual Fund Data Source
              </h3>
              <p style={{
                margin: '2px 0 0 0',
                fontSize: '14px',
                color: fundData.length > 0 && fundData[0]?.source === 'MFAPI.in' ? '#10b981' : '#f59e0b'
              }}>
                {fundData.length > 0 && fundData[0]?.source === 'MFAPI.in'
                  ? '✅ Real Data from MFAPI.in'
                  : '⚠️ Using Mock Data (MFAPI.in Unavailable)'}
              </p>
            </div>
          </div>

          {lastUpdated && (
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>
                Last Updated: {lastUpdated.toLocaleTimeString()}
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                Auto-refreshes every 30 seconds
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="cards-section">
        <div className="card-grid">
          <div className="card">
            <h3 className="card-title">Active Clients</h3>
            <p className="value">156</p>
            <p className="desc">Under your guidance</p>
          </div>

          <div className="card">
            <h3 className="card-title">Avg Portfolio Return</h3>
            <p className="value">12.8%</p>
            <p className="positive">Above industry average</p>
          </div>

          <div className="card">
            <h3 className="card-title">Pending Reviews</h3>
            <p className="value">8</p>
            <p className="warning">Client portfolio reviews</p>
          </div>

          <div className="card">
            <h3 className="card-title">Commission This Month</h3>
            <p className="value">₹ 85,000</p>
            <p className="positive">+22% from last month</p>
          </div>
        </div>
      </div>

      {/* REAL-TIME MARKET DATA */}
      <div className="cards-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 className="section-title">📊 Real-Time Market Insights</h2>
          {lastUpdated && (
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
              {loading && <span style={{ marginLeft: "10px", color: "#2563eb" }}>🔄 Updating...</span>}
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="card-grid">
          <div className="card">
            <h3 className="card-title">Market Sentiment</h3>
            <div style={{
              height: "120px",
              background: marketSentiment ? `linear-gradient(135deg, ${marketSentiment.color}20 0%, ${marketSentiment.color}40 100%)` : "#f3f4f6",
              borderRadius: "8px",
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: marketSentiment?.color || "#6b7280",
              fontSize: "14px",
              border: marketSentiment ? `2px solid ${marketSentiment.color}` : "none"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>
                {marketSentiment?.icon || "📊"}
              </div>
              {marketSentiment?.sentiment || "Loading..."}
              <span style={{ fontSize: "12px", opacity: 0.8, marginTop: "5px" }}>Live Market Data</span>
            </div>
            <p className={marketSentiment?.sentiment === 'Bullish' ? 'positive' : marketSentiment?.sentiment === 'Bearish' ? 'warning' : 'desc'} style={{ marginTop: "8px" }}>
              {marketData ? `Avg: +${(Object.values(marketData).reduce((sum, index) => sum + index.changePercent, 0) / Object.keys(marketData).length).toFixed(1)}%` : 'Loading...'}
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Nifty 50</h3>
            <p className="value">
              {loading ? '...' : marketData?.nifty50?.value?.toLocaleString('en-IN') || '22,847.50'}
            </p>
            <p className={marketData?.nifty50?.changePercent >= 0 ? 'positive' : 'warning'}>
              {marketData?.nifty50?.changePercent >= 0 ? '+' : ''}{marketData?.nifty50?.changePercent?.toFixed(1) || '1.8'}%
            </p>
            <div style={{
              height: "60px",
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              borderRadius: "4px",
              marginTop: "10px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                height: `${Math.max(10, Math.min(60, 30 + (marketData?.nifty50?.changePercent || 1.8) * 2))}px`,
                background: "rgba(255,255,255,0.3)",
                borderRadius: "4px 4px 0 0"
              }}></div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Sensex</h3>
            <p className="value">
              {loading ? '...' : marketData?.sensex?.value?.toLocaleString('en-IN') || '74,123.45'}
            </p>
            <p className={marketData?.sensex?.changePercent >= 0 ? 'positive' : 'warning'}>
              {marketData?.sensex?.changePercent >= 0 ? '+' : ''}{marketData?.sensex?.changePercent?.toFixed(1) || '1.6'}%
            </p>
            <div style={{
              height: "60px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: "4px",
              marginTop: "10px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                height: `${Math.max(10, Math.min(60, 30 + (marketData?.sensex?.changePercent || 1.6) * 2))}px`,
                background: "rgba(255,255,255,0.3)",
                borderRadius: "4px 4px 0 0"
              }}></div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Top Performing Fund</h3>
            <p className="value" style={{ fontSize: "16px" }}>
              {loading ? '...' : fundData.find(fund => fund.change > 0)?.name || 'HDFC Top 100 Fund'}
            </p>
            <p className="positive">
              {fundData.find(fund => fund.change > 0)?.change >= 0 ? '+' : ''}{fundData.find(fund => fund.change > 0)?.change?.toFixed(1) || '2.3'}%
            </p>
            <div style={{
              height: "60px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "4px",
              marginTop: "10px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                height: `${Math.max(10, Math.min(60, 20 + (fundData.find(fund => fund.change > 0)?.change || 2.3) * 3))}px`,
                background: "rgba(255,255,255,0.3)",
                borderRadius: "4px 4px 0 0"
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* LINE CHART - MARKET TRENDS */}
      <div className="cards-section">
        <h2 className="section-title">📈 Market Trend Analysis</h2>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          margin: "20px 0"
        }}>
          <div style={{
            height: "300px",
            position: "relative",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e2e8f0"
          }}>
            {/* Chart Title */}
            <div style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "600"
            }}>
              Nifty 50 & Sensex - 7 Day Trend
            </div>

            {/* SVG Chart */}
            <svg width="100%" height="220" viewBox="0 0 600 220" style={{ overflow: "visible" }}>
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Y-axis labels */}
              {[22000, 22200, 22400, 22600, 22800].map((value, index) => (
                <text key={index} x="20" y={200 - (index * 40)} fontSize="10" fill="#64748b" textAnchor="middle">
                  {value}
                </text>
              ))}

              {/* Nifty 50 Line */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                points={historicalData.slice(-7).map((data, index) => {
                  const x = 80 + (index * 75);
                  const maxNifty = Math.max(...historicalData.map(d => d.nifty));
                  const minNifty = Math.min(...historicalData.map(d => d.nifty));
                  const range = maxNifty - minNifty || 1;
                  const y = 200 - ((data.nifty - minNifty) / range) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Sensex Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={historicalData.slice(-7).map((data, index) => {
                  const x = 80 + (index * 75);
                  const maxSensex = Math.max(...historicalData.map(d => d.sensex));
                  const minSensex = Math.min(...historicalData.map(d => d.sensex));
                  const range = maxSensex - minSensex || 1;
                  const y = 200 - ((data.sensex - minSensex) / range) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Data Points - Nifty 50 */}
              {historicalData.slice(-7).map((data, index) => {
                const x = 80 + (index * 75);
                const maxNifty = Math.max(...historicalData.map(d => d.nifty));
                const minNifty = Math.min(...historicalData.map(d => d.nifty));
                const range = maxNifty - minNifty || 1;
                const y = 200 - ((data.nifty - minNifty) / range) * 160;

                return (
                  <g key={`nifty-${index}`}>
                    {/* Outer glow ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="0"
                      opacity="0"
                      className="nifty-glow"
                    >
                      <animate
                        attributeName="stroke-width"
                        values="0;3;0"
                        dur="0.6s"
                        begin="mouseover"
                        fill="freeze"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.3;0"
                        dur="0.6s"
                        begin="mouseover"
                        fill="freeze"
                      />
                    </circle>

                    {/* Main data point */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#2563eb"
                      stroke="white"
                      strokeWidth="2"
                      className="data-point nifty-point"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const previousValue = index > 0 ? historicalData[index - 1]?.nifty : data.nifty;
                        const change = data.nifty - previousValue;
                        const changePercent = ((change / previousValue) * 100);

                        setSelectedPoint({
                          icon: '📈',
                          title: 'Nifty 50 Detailed Analysis',
                          subtitle: `Data Point ${index + 1} - ${new Date(data.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}`,
                          sections: [
                            {
                              title: '📊 Current Values',
                              details: [
                                { label: 'Index Value', value: data.nifty.toLocaleString('en-IN'), color: '#2563eb' },
                                { label: 'Daily Change', value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}`, color: change >= 0 ? '#10b981' : '#ef4444' },
                                { label: 'Change %', value: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`, color: changePercent >= 0 ? '#10b981' : '#ef4444' },
                                { label: 'Volume', value: `${(data.volume / 10000000).toFixed(1)} Cr`, color: '#f59e0b' }
                              ]
                            },
                            {
                              title: '📈 Market Context',
                              details: [
                                { label: 'Market Trend', value: changePercent > 0.5 ? 'Bullish' : changePercent < -0.5 ? 'Bearish' : 'Neutral', color: changePercent > 0.5 ? '#10b981' : changePercent < -0.5 ? '#ef4444' : '#f59e0b' },
                                { label: 'Volatility Level', value: Math.abs(changePercent) > 2 ? 'High' : Math.abs(changePercent) > 1 ? 'Medium' : 'Low', color: Math.abs(changePercent) > 2 ? '#ef4444' : Math.abs(changePercent) > 1 ? '#f59e0b' : '#10b981' },
                                { label: 'Liquidity', value: data.volume > 250000000 ? 'High' : data.volume > 150000000 ? 'Medium' : 'Low', color: data.volume > 250000000 ? '#10b981' : data.volume > 150000000 ? '#f59e0b' : '#ef4444' }
                              ]
                            }
                          ],
                          insights: [
                            `Nifty 50 ${changePercent >= 0 ? 'gained' : 'lost'} ${Math.abs(changePercent).toFixed(2)}% on this trading day`,
                            changePercent > 1 ? 'Strong upward movement suggests positive market sentiment' : changePercent < -1 ? 'Significant downward pressure indicates bearish conditions' : 'Market showing consolidation with minimal movement',
                            `Trading volume of ${(data.volume / 10000000).toFixed(1)} Cr indicates ${data.volume > 200000000 ? 'high' : 'moderate'} market participation`,
                            'Consider monitoring sector-specific ETFs for diversification opportunities'
                          ]
                        });
                        setShowDetailModal(true);
                      }}
                    >
                      <animate
                        attributeName="r"
                        values="4;8;4"
                        dur="0.4s"
                        begin="mouseover"
                        fill="freeze"
                      />
                      <animate
                        attributeName="stroke-width"
                        values="2;4;2"
                        dur="0.4s"
                        begin="mouseover"
                        fill="freeze"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Data Points - Sensex */}
              {historicalData.slice(-7).map((data, index) => {
                const x = 80 + (index * 75);
                const maxSensex = Math.max(...historicalData.map(d => d.sensex));
                const minSensex = Math.min(...historicalData.map(d => d.sensex));
                const range = maxSensex - minSensex || 1;
                const y = 200 - ((data.sensex - minSensex) / range) * 160;

                return (
                  <g key={`sensex-${index}`}>
                    {/* Outer glow ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="0"
                      opacity="0"
                      className="sensex-glow"
                    >
                      <animate
                        attributeName="stroke-width"
                        values="0;3;0"
                        dur="0.6s"
                        begin="mouseover"
                        fill="freeze"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.3;0"
                        dur="0.6s"
                        begin="mouseover"
                        fill="freeze"
                      />
                    </circle>

                    {/* Main data point */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                      className="data-point sensex-point"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const previousValue = index > 0 ? historicalData[index - 1]?.sensex : data.sensex;
                        const change = data.sensex - previousValue;
                        const changePercent = ((change / previousValue) * 100);

                        setSelectedPoint({
                          icon: '📊',
                          title: 'Sensex Detailed Analysis',
                          subtitle: `Data Point ${index + 1} - ${new Date(data.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}`,
                          sections: [
                            {
                              title: '📊 Current Values',
                              details: [
                                { label: 'Index Value', value: data.sensex.toLocaleString('en-IN'), color: '#10b981' },
                                { label: 'Daily Change', value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}`, color: change >= 0 ? '#10b981' : '#ef4444' },
                                { label: 'Change %', value: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`, color: changePercent >= 0 ? '#10b981' : '#ef4444' },
                                { label: 'Volume', value: `${(data.volume / 10000000).toFixed(1)} Cr`, color: '#f59e0b' }
                              ]
                            },
                            {
                              title: '🏢 Market Breadth',
                              details: [
                                { label: 'Market Direction', value: changePercent > 0.5 ? 'Bullish' : changePercent < -0.5 ? 'Bearish' : 'Neutral', color: changePercent > 0.5 ? '#10b981' : changePercent < -0.5 ? '#ef4444' : '#f59e0b' },
                                { label: 'Price Action', value: Math.abs(changePercent) > 2 ? 'Volatile' : Math.abs(changePercent) > 1 ? 'Moderate' : 'Stable', color: Math.abs(changePercent) > 2 ? '#ef4444' : Math.abs(changePercent) > 1 ? '#f59e0b' : '#10b981' },
                                { label: 'Trading Activity', value: data.volume > 200000000 ? 'Heavy' : data.volume > 120000000 ? 'Normal' : 'Light', color: data.volume > 200000000 ? '#10b981' : data.volume > 120000000 ? '#f59e0b' : '#ef4444' }
                              ]
                            }
                          ],
                          insights: [
                            `Sensex ${changePercent >= 0 ? 'advanced' : 'declined'} by ${Math.abs(changePercent).toFixed(2)}% on this session`,
                            changePercent > 1 ? 'Broad market rally indicates positive investor sentiment' : changePercent < -1 ? 'Market-wide selling pressure suggests risk-off environment' : 'Sensex showing sideways movement with consolidation',
                            `Volume of ${(data.volume / 10000000).toFixed(1)} Cr suggests ${data.volume > 180000000 ? 'strong' : 'moderate'} market conviction`,
                            'Monitor banking and IT sector stocks for leadership signals'
                          ]
                        });
                        setShowDetailModal(true);
                      }}
                    >
                      <animate
                        attributeName="r"
                        values="4;8;4"
                        dur="0.4s"
                        begin="mouseover"
                        fill="freeze"
                      />
                      <animate
                        attributeName="stroke-width"
                        values="2;4;2"
                        dur="0.4s"
                        begin="mouseover"
                        fill="freeze"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {historicalData.slice(-7).map((data, index) => (
                <text key={index} x={80 + (index * 75)} y="220" fontSize="10" fill="#64748b" textAnchor="middle">
                  {new Date(data.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </text>
              ))}
            </svg>

            {/* Legend */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              marginTop: "15px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "12px", height: "3px", backgroundColor: "#2563eb", borderRadius: "2px" }}></div>
                <span style={{ fontSize: "12px", color: "#374151", fontWeight: "500" }}>Nifty 50</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "12px", height: "3px", backgroundColor: "#10b981", borderRadius: "2px" }}></div>
                <span style={{ fontSize: "12px", color: "#374151", fontWeight: "500" }}>Sensex</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MARKET ANALYSIS CHART */}
      <div className="cards-section">
        <h2 className="section-title">🔄 Market Movement Analysis</h2>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          margin: "20px 0"
        }}>
          {/* Chart Container */}
          <div style={{
            height: "250px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
            border: "1px solid #e2e8f0"
          }}>
            {/* Y-axis labels */}
            <div style={{
              position: "absolute",
              left: "10px",
              top: "20px",
              bottom: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#64748b"
            }}>
              <span>23,000</span>
              <span>22,500</span>
              <span>22,000</span>
              <span>21,500</span>
            </div>

            {/* Chart area */}
            <div style={{
              marginLeft: "40px",
              height: "180px",
              position: "relative",
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              paddingBottom: "30px"
            }}>
              {historicalData.slice(-7).map((data, index) => {
                const maxNifty = Math.max(...historicalData.map(d => d.nifty));
                const minNifty = Math.min(...historicalData.map(d => d.nifty));
                const range = maxNifty - minNifty;
                const height = range > 0 ? ((data.nifty - minNifty) / range) * 150 + 20 : 80;

                return (
                  <div key={index} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    margin: "0 2px"
                  }}>
                    <div style={{
                      width: "100%",
                      height: `${height}px`,
                      background: `linear-gradient(180deg, #10b981 ${height > 80 ? '60%' : '100%'}, #ef4444 ${height < 80 ? '40%' : '0%'})`,
                      borderRadius: "3px 3px 0 0",
                      position: "relative",
                      minHeight: "20px"
                    }}>
                      {/* Value tooltip */}
                      <div style={{
                        position: "absolute",
                        top: "-25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#1f2937",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        fontSize: "10px",
                        whiteSpace: "nowrap",
                        opacity: 0.8
                      }}>
                        {data.nifty.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div style={{
              position: "absolute",
              bottom: "10px",
              left: "40px",
              right: "20px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "#64748b"
            }}>
              {historicalData.slice(-7).map((data, index) => (
                <span key={index}>
                  {new Date(data.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>

          {/* Market Indicators */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginTop: "20px"
          }}>
            <div style={{
              background: "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Nifty 50</div>
              <div style={{
                fontSize: "16px",
                fontWeight: "600",
                color: marketData?.nifty50?.changePercent >= 0 ? "#10b981" : "#ef4444"
              }}>
                {marketData?.nifty50?.changePercent >= 0 ? '+' : ''}{marketData?.nifty50?.changePercent?.toFixed(1) || '1.8'}%
              </div>
            </div>

            <div style={{
              background: "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Bank Nifty</div>
              <div style={{
                fontSize: "16px",
                fontWeight: "600",
                color: marketData?.bankNifty?.changePercent >= 0 ? "#10b981" : "#ef4444"
              }}>
                {marketData?.bankNifty?.changePercent >= 0 ? '+' : ''}{marketData?.bankNifty?.changePercent?.toFixed(1) || '2.1'}%
              </div>
            </div>

            <div style={{
              background: "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>IT Sector</div>
              <div style={{
                fontSize: "16px",
                fontWeight: "600",
                color: marketData?.itSector?.changePercent >= 0 ? "#10b981" : "#ef4444"
              }}>
                {marketData?.itSector?.changePercent >= 0 ? '+' : ''}{marketData?.itSector?.changePercent?.toFixed(1) || '0.9'}%
              </div>
            </div>

            <div style={{
              background: "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Volume</div>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#2563eb"
              }}>
                {marketData ? `${(marketData.nifty50.volume / 1000000000).toFixed(1)}B` : '2.4B'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FUND PERFORMANCE LINE CHART */}
      <div className="cards-section">
        <h2 className="section-title">📊 Fund Category Performance Trends</h2>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          margin: "20px 0"
        }}>
          <div style={{
            height: "280px",
            position: "relative",
            background: "linear-gradient(135deg, #fefefe 0%, #f8fafc 100%)",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e2e8f0"
          }}>
            {/* Chart Title */}
            <div style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "600"
            }}>
              Fund Returns by Category (Last 7 Days)
            </div>

            {/* SVG Chart */}
            <svg width="100%" height="200" viewBox="0 0 600 200" style={{ overflow: "visible" }}>
              {/* Grid */}
              <defs>
                <pattern id="fundGrid" width="60" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#fundGrid)" />

              {/* Y-axis labels (-5% to +5%) */}
              {[-5, -2.5, 0, 2.5, 5].map((value, index) => (
                <text key={index} x="25" y={180 - (index * 40)} fontSize="10" fill="#64748b" textAnchor="middle">
                  {value > 0 ? '+' : ''}{value}%
                </text>
              ))}

              {/* Generate sample fund performance data */}
              {(() => {
                const categories = ['Large Cap', 'Mid Cap', 'Small Cap', 'Corporate Bond'];
                const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

                return categories.map((category, categoryIndex) => {
                  // Generate realistic performance data
                  const performanceData = Array.from({ length: 7 }, (_, i) => {
                    const baseValue = categoryIndex === 0 ? 2 : categoryIndex === 1 ? 1.5 :
                                    categoryIndex === 2 ? 3 : -0.5;
                    const variation = (Math.random() - 0.5) * 2;
                    return baseValue + variation;
                  });

                  return (
                    <polyline
                      key={category}
                      fill="none"
                      stroke={colors[categoryIndex]}
                      strokeWidth="2"
                      strokeDasharray={categoryIndex === 3 ? "5,5" : "none"}
                      points={performanceData.map((value, index) => {
                        const x = 80 + (index * 75);
                        const y = 180 - ((value + 5) / 10) * 160; // Scale from -5% to +5%
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  );
                });
              })()}

              {/* Data Points for each category */}
              {(() => {
                const categories = ['Large Cap', 'Mid Cap', 'Small Cap', 'Corporate Bond'];
                const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

                return categories.map((category, categoryIndex) => {
                  const performanceData = Array.from({ length: 7 }, (_, i) => {
                    const baseValue = categoryIndex === 0 ? 2 : categoryIndex === 1 ? 1.5 :
                                    categoryIndex === 2 ? 3 : -0.5;
                    const variation = (Math.random() - 0.5) * 2;
                    return baseValue + variation;
                  });

                  return performanceData.map((value, index) => {
                    const x = 80 + (index * 75);
                    const y = 180 - ((value + 5) / 10) * 160;

                    return (
                      <g key={`${category}-${index}`}>
                        {/* Glow effect */}
                        <circle
                          cx={x}
                          cy={y}
                          r="10"
                          fill="none"
                          stroke={colors[categoryIndex]}
                          strokeWidth="0"
                          opacity="0"
                          className={`fund-glow-${categoryIndex}`}
                        >
                          <animate
                            attributeName="stroke-width"
                            values="0;2;0"
                            dur="0.5s"
                            begin="mouseover"
                            fill="freeze"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;0.4;0"
                            dur="0.5s"
                            begin="mouseover"
                            fill="freeze"
                          />
                        </circle>

                        {/* Main data point */}
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          fill={colors[categoryIndex]}
                          stroke="white"
                          strokeWidth="1"
                          className={`fund-point fund-point-${categoryIndex}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            // Calculate performance metrics
                            const categories = ['Large Cap', 'Mid Cap', 'Small Cap', 'Corporate Bond'];
                            const categoryName = categories[categoryIndex];
                            const performanceRating = value > 3 ? 'Excellent' : value > 2 ? 'Very Good' : value > 1 ? 'Good' : value > 0 ? 'Fair' : 'Poor';
                            const riskLevel = categoryIndex === 2 ? 'High' : categoryIndex === 0 ? 'Medium' : 'Low';
                            const marketCondition = value > 2 ? 'Bull Market' : value > 0 ? 'Sideways' : 'Bear Market';

                            setSelectedPoint({
                              icon: '📊',
                              title: `${categoryName} Fund Performance`,
                              subtitle: `${new Date(Date.now() - (6-index) * 24 * 60 * 60 * 1000 - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}`,
                              sections: [
                                {
                                  title: '📈 Performance Metrics',
                                  details: [
                                    { label: '1-Day Return', value: `${value > 0 ? '+' : ''}${value.toFixed(2)}%`, color: value >= 0 ? '#10b981' : '#ef4444' },
                                    { label: 'Performance Rating', value: performanceRating, color: value > 2 ? '#10b981' : value > 1 ? '#f59e0b' : '#ef4444' },
                                    { label: 'Risk Level', value: riskLevel, color: categoryIndex === 2 ? '#ef4444' : categoryIndex === 0 ? '#f59e0b' : '#10b981' },
                                    { label: 'Market Condition', value: marketCondition, color: value > 2 ? '#10b981' : value > 0 ? '#f59e0b' : '#ef4444' }
                                  ]
                                },
                                {
                                  title: '💼 Fund Category Analysis',
                                  details: [
                                    { label: 'Category Type', value: categoryName, color: colors[categoryIndex] },
                                    { label: 'Investment Style', value: categoryIndex === 0 ? 'Blue-chip Focus' : categoryIndex === 1 ? 'Growth Oriented' : categoryIndex === 2 ? 'High Growth' : 'Income Focus', color: colors[categoryIndex] },
                                    { label: 'Typical Horizon', value: categoryIndex === 3 ? 'Short-term' : 'Long-term', color: categoryIndex === 3 ? '#f59e0b' : '#10b981' },
                                    { label: 'Target Investors', value: categoryIndex === 2 ? 'Aggressive' : categoryIndex === 0 ? 'Conservative' : 'Moderate', color: categoryIndex === 2 ? '#ef4444' : categoryIndex === 0 ? '#10b981' : '#f59e0b' }
                                  ]
                                }
                              ],
                              insights: [
                                `${categoryName} funds ${value > 0 ? 'gained' : 'lost'} ${Math.abs(value).toFixed(2)}% in the last trading session`,
                                value > 2 ? `Strong performance in ${categoryName} indicates positive market sentiment` : value < 0 ? `Negative returns suggest caution for ${categoryName} investments` : `Moderate performance shows market consolidation`,
                                `Risk assessment: ${riskLevel} risk profile suitable for ${categoryIndex === 2 ? 'aggressive' : categoryIndex === 0 ? 'conservative' : 'moderate'} investors`,
                                `Consider ${value > 1 ? 'increasing' : 'reducing'} exposure to ${categoryName} funds based on your risk tolerance`,
                                categoryIndex === 3 ? 'Bond funds provide stability during equity market volatility' : 'Equity funds offer growth potential but with higher risk'
                              ]
                            });
                            setShowDetailModal(true);
                          }}
                        >
                          <animate
                            attributeName="r"
                            values="3;6;3"
                            dur="0.25s"
                            begin="mouseover"
                            fill="freeze"
                          />
                          <animate
                            attributeName="stroke-width"
                            values="1;3;1"
                            dur="0.25s"
                            begin="mouseover"
                            fill="freeze"
                          />
                        </circle>
                      </g>
                    );
                  });
                });
              })()}

              {/* X-axis labels */}
              {Array.from({ length: 7 }, (_, index) => {
                const date = new Date(Date.now() - (6-index) * 24 * 60 * 60 * 1000 - 30 * 24 * 60 * 60 * 1000);
                return (
                  <text key={index} x={80 + (index * 75)} y="200" fontSize="10" fill="#64748b" textAnchor="middle">
                    {date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </text>
                );
              })}
            </svg>

            {/* Legend */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
              marginTop: "15px",
              maxWidth: "400px",
              margin: "15px auto 0"
            }}>
              {[
                { name: 'Large Cap', color: '#2563eb' },
                { name: 'Mid Cap', color: '#10b981' },
                { name: 'Small Cap', color: '#f59e0b' },
                { name: 'Corporate Bond', color: '#8b5cf6' }
              ].map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "12px",
                    height: "2px",
                    backgroundColor: item.color,
                    borderRadius: "1px"
                  }}></div>
                  <span style={{ fontSize: "11px", color: "#374151", fontWeight: "500" }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOP PERFORMING FUNDS */}
      <div className="cards-section">
        <h2 className="section-title">🏆 Top Performing Mutual Funds</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}>
          {Object.entries(fundCategories).map(([category, funds]) => (
            <div key={category} style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{
                color: "#1e293b",
                fontSize: "16px",
                marginBottom: "15px",
                borderBottom: "2px solid #e2e8f0",
                paddingBottom: "8px"
              }}>
                {category} Funds
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {funds.slice(0, 3).map((fund, index) => (
                  <div key={index} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    background: "#f8fafc",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        fontSize: "14px",
                        marginBottom: "2px"
                      }}>
                        {fund.name}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#64748b"
                      }}>
                        NAV: ₹{fund.nav.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontWeight: "600",
                        color: fund.change >= 0 ? "#10b981" : "#ef4444",
                        fontSize: "14px"
                      }}>
                        {fund.change >= 0 ? '+' : ''}{fund.change}%
                      </div>
                      <div style={{
                        fontSize: "11px",
                        color: "#64748b"
                      }}>
                        AUM: {fund.aum}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADVANCED MARKET ANALYSIS - CANDLESTICK CHART */}
      <div className="cards-section">
        <h2 className="section-title">📊 Advanced Market Analysis</h2>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          margin: "20px 0"
        }}>
          <div style={{
            height: "320px",
            position: "relative",
            background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e2e8f0"
          }}>
            {/* Chart Title */}
            <div style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "600"
            }}>
              Nifty 50 Candlestick Chart - Intraday Movement
            </div>

            {/* SVG Candlestick Chart */}
            <svg width="100%" height="240" viewBox="0 0 600 240" style={{ overflow: "visible" }}>
              {/* Background Grid */}
              <defs>
                <pattern id="candleGrid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#candleGrid)" />

              {/* Y-axis labels */}
              {[22300, 22400, 22500, 22600, 22700].map((value, index) => (
                <text key={index} x="20" y={220 - (index * 40)} fontSize="10" fill="#64748b" textAnchor="middle">
                  {value}
                </text>
              ))}

              {/* Generate candlestick data */}
              {(() => {
                const candleData = Array.from({ length: 8 }, (_, i) => {
                  const basePrice = 22450 + (i * 15) + (Math.random() - 0.5) * 50;
                  const volatility = 20 + Math.random() * 30;
                  const high = basePrice + volatility;
                  const low = basePrice - volatility;
                  const open = basePrice + (Math.random() - 0.5) * volatility * 0.8;
                  const close = basePrice + (Math.random() - 0.5) * volatility * 0.8;

                  return { high, low, open, close };
                });

                const maxPrice = Math.max(...candleData.map(c => c.high));
                const minPrice = Math.min(...candleData.map(c => c.low));
                const priceRange = maxPrice - minPrice || 1;

                return candleData.map((candle, index) => {
                  const x = 70 + (index * 60);
                  const openY = 220 - ((candle.open - minPrice) / priceRange) * 180;
                  const closeY = 220 - ((candle.close - minPrice) / priceRange) * 180;
                  const highY = 220 - ((candle.high - minPrice) / priceRange) * 180;
                  const lowY = 220 - ((candle.low - minPrice) / priceRange) * 180;

                  const isGreen = candle.close > candle.open;
                  const color = isGreen ? '#10b981' : '#ef4444';
                  const bodyHeight = Math.abs(closeY - openY);
                  const bodyY = Math.min(openY, closeY);

                  return (
                    <g
                      key={index}
                      className={`candlestick candlestick-${index}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const candleType = candle.close > candle.open ? 'Bullish' : 'Bearish';
                        const bodyRange = Math.abs(candle.close - candle.open);
                        const totalRange = candle.high - candle.low;
                        const bodyPercent = totalRange > 0 ? (bodyRange / totalRange) * 100 : 0;
                        const upperWick = candle.high - Math.max(candle.open, candle.close);
                        const lowerWick = Math.min(candle.open, candle.close) - candle.low;

                        setSelectedPoint({
                          icon: candle.close > candle.open ? '🟢' : '🔴',
                          title: `${candleType} Candlestick Analysis`,
                          subtitle: `Session ${String.fromCharCode(65 + index)} - ${candleType} Market Action`,
                          sections: [
                            {
                              title: '📊 OHLC Values',
                              details: [
                                { label: 'Open', value: candle.open.toFixed(2), color: '#64748b' },
                                { label: 'High', value: candle.high.toFixed(2), color: '#10b981' },
                                { label: 'Low', value: candle.low.toFixed(2), color: '#ef4444' },
                                { label: 'Close', value: candle.close.toFixed(2), color: candle.close > candle.open ? '#10b981' : '#ef4444' }
                              ]
                            },
                            {
                              title: '📈 Technical Analysis',
                              details: [
                                { label: 'Candle Type', value: candleType, color: candle.close > candle.open ? '#10b981' : '#ef4444' },
                                { label: 'Body Size', value: `${bodyPercent.toFixed(1)}% of range`, color: bodyPercent > 70 ? '#ef4444' : bodyPercent > 40 ? '#f59e0b' : '#10b981' },
                                { label: 'Upper Wick', value: upperWick.toFixed(2), color: upperWick > lowerWick * 2 ? '#f59e0b' : '#64748b' },
                                { label: 'Lower Wick', value: lowerWick.toFixed(2), color: lowerWick > upperWick * 2 ? '#f59e0b' : '#64748b' }
                              ]
                            },
                            {
                              title: '💹 Market Signals',
                              details: [
                                { label: 'Trend Direction', value: candle.close > candle.open ? 'Upward' : 'Downward', color: candle.close > candle.open ? '#10b981' : '#ef4444' },
                                { label: 'Rejection Signals', value: upperWick > bodyRange * 2 ? 'Resistance' : lowerWick > bodyRange * 2 ? 'Support' : 'Neutral', color: upperWick > bodyRange * 2 ? '#ef4444' : lowerWick > bodyRange * 2 ? '#10b981' : '#64748b' },
                                { label: 'Volume Impact', value: 'High Participation', color: '#2563eb' },
                                { label: 'Conviction Level', value: bodyPercent > 60 ? 'Strong' : bodyPercent > 30 ? 'Moderate' : 'Weak', color: bodyPercent > 60 ? '#10b981' : bodyPercent > 30 ? '#f59e0b' : '#ef4444' }
                              ]
                            }
                          ],
                          insights: [
                            `This ${candleType.toLowerCase()} candle shows ${candle.close > candle.open ? 'buying' : 'selling'} pressure with ${bodyPercent.toFixed(1)}% of the range as body`,
                            candle.close > candle.open ? 'Green candle indicates bullish sentiment and potential upward continuation' : 'Red candle suggests bearish pressure and possible downward movement',
                            upperWick > lowerWick * 2 ? 'Long upper wick shows selling resistance near highs' : lowerWick > upperWick * 2 ? 'Long lower wick indicates buying support near lows' : 'Balanced wick structure shows equilibrium',
                            bodyPercent > 70 ? 'Strong conviction candle with clear directional bias' : bodyPercent < 30 ? 'Indecision candle suggesting market uncertainty' : 'Moderate conviction with balanced supply/demand',
                            candle.close > candle.open ? 'Consider long positions or holding existing positions' : 'Exercise caution and consider protective stops'
                          ]
                        });
                        setShowDetailModal(true);
                      }}
                    >
                      {/* Glow effect background */}
                      <rect
                        x={x - 12}
                        y={highY - 5}
                        width="24"
                        height={lowY - highY + 10}
                        fill="none"
                        stroke={color}
                        strokeWidth="0"
                        opacity="0"
                        rx="3"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="0;2;0"
                          dur="0.4s"
                          begin="mouseover"
                          fill="freeze"
                        />
                        <animate
                          attributeName="opacity"
                          values="0;0.2;0"
                          dur="0.4s"
                          begin="mouseover"
                          fill="freeze"
                        />
                      </rect>

                      {/* High-Low line (wick) */}
                      <line
                        x1={x}
                        y1={highY}
                        x2={x}
                        y2={lowY}
                        stroke={color}
                        strokeWidth="1"
                        className="wick"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="1;2;1"
                          dur="0.3s"
                          begin="mouseover"
                          fill="freeze"
                        />
                      </line>

                      {/* Open-Close body */}
                      <rect
                        x={x - 8}
                        y={bodyY}
                        width="16"
                        height={Math.max(bodyHeight, 2)}
                        fill={color}
                        stroke={color}
                        strokeWidth="1"
                        className="candle-body"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="1;3;1"
                          dur="0.3s"
                          begin="mouseover"
                          fill="freeze"
                        />
                        <animate
                          attributeName="width"
                          values="16;20;16"
                          dur="0.3s"
                          begin="mouseover"
                          fill="freeze"
                        />
                        <animate
                          attributeName="x"
                          values={`${x - 8};${x - 10};${x - 8}`}
                          dur="0.3s"
                          begin="mouseover"
                          fill="freeze"
                        />
                      </rect>

                      {/* Tooltip */}
                      <title>
                        Open: {candle.open.toFixed(2)}
                        Close: {candle.close.toFixed(2)}
                        High: {candle.high.toFixed(2)}
                        Low: {candle.low.toFixed(2)}
                      </title>
                    </g>
                  );
                });
              })()}

              {/* X-axis labels */}
              {Array.from({ length: 8 }, (_, index) => (
                <text key={index} x={70 + (index * 60)} y="240" fontSize="10" fill="#64748b" textAnchor="middle">
                  {String.fromCharCode(65 + index)}
                </text>
              ))}

              {/* Volume bars at bottom */}
              <text x="10" y="260" fontSize="12" fill="#374151" fontWeight="600">
                Volume:
              </text>
              {Array.from({ length: 8 }, (_, index) => {
                const volume = 200000 + Math.random() * 150000;
                const volumeHeight = (volume / 350000) * 30;

                return (
                  <rect
                    key={`volume-${index}`}
                    x={62 + (index * 60)}
                    y={270 - volumeHeight}
                    width="16"
                    height={volumeHeight}
                    fill="#64748b"
                    opacity="0.6"
                  >
                    <title>Volume: {(volume / 100000).toFixed(0)}L</title>
                  </rect>
                );
              })}
            </svg>

            {/* Chart Info */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              fontSize: "12px",
              color: "#64748b"
            }}>
              <div>
                <span style={{ color: "#10b981", fontWeight: "600" }}>●</span> Bullish
                <span style={{ color: "#ef4444", fontWeight: "600", marginLeft: "15px" }}>●</span> Bearish
              </div>
              <div>
                Intraday: 9:15 AM - 3:30 PM IST
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT BUTTON AT BOTTOM */}
      <div className="logout-container">
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
      </div>
    </>
  );
}

export default FinancialAdvisorDashboard;
