import React, { useState } from "react";
import { Link } from "react-router-dom";

function PlatformSettings({ user }) {
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

  const [settings, setSettings] = useState({
    platformName: "MutualFund Pro",
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    dataRetentionDays: 365,
    apiRateLimit: 1000,
    supportEmail: "support@mutualfundpro.com",
    backupFrequency: "daily"
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    alert("Settings saved successfully! ✅");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to defaults?")) {
      alert("Settings reset to defaults! 🔄");
    }
  };

  const settingSections = [
    {
      title: "General Settings",
      icon: "⚙️",
      settings: [
        { key: "platformName", label: "Platform Name", type: "text", value: settings.platformName },
        { key: "supportEmail", label: "Support Email", type: "email", value: settings.supportEmail }
      ]
    },
    {
      title: "Security Settings",
      icon: "🔒",
      settings: [
        { key: "twoFactorAuth", label: "Two-Factor Authentication", type: "toggle", value: settings.twoFactorAuth },
        { key: "maxLoginAttempts", label: "Max Login Attempts", type: "number", value: settings.maxLoginAttempts },
        { key: "sessionTimeout", label: "Session Timeout (minutes)", type: "number", value: settings.sessionTimeout }
      ]
    },
    {
      title: "System Settings",
      icon: "🖥️",
      settings: [
        { key: "maintenanceMode", label: "Maintenance Mode", type: "toggle", value: settings.maintenanceMode },
        { key: "dataRetentionDays", label: "Data Retention (days)", type: "number", value: settings.dataRetentionDays },
        { key: "apiRateLimit", label: "API Rate Limit (requests/hour)", type: "number", value: settings.apiRateLimit }
      ]
    },
    {
      title: "Notification Settings",
      icon: "📧",
      settings: [
        { key: "emailNotifications", label: "Email Notifications", type: "toggle", value: settings.emailNotifications },
        { key: "smsNotifications", label: "SMS Notifications", type: "toggle", value: settings.smsNotifications }
      ]
    },
    {
      title: "Backup Settings",
      icon: "💾",
      settings: [
        { key: "backupFrequency", label: "Backup Frequency", type: "select", value: settings.backupFrequency,
          options: ["hourly", "daily", "weekly", "monthly"] }
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <h1>🔧 Platform Settings</h1>
      <p>Configure system-wide settings and preferences for the MutualFund Pro platform.</p>

      {/* Settings Sections */}
      <div className="settings-container">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="settings-section">
            <h2 className="settings-section-title">
              <span className="section-icon">{section.icon}</span>
              {section.title}
            </h2>

            <div className="settings-grid">
              {section.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="setting-item">
                  <label className="setting-label">{setting.label}</label>

                  {setting.type === "text" || setting.type === "email" ? (
                    <input
                      type={setting.type}
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      className="setting-input"
                    />
                  ) : setting.type === "number" ? (
                    <input
                      type="number"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
                      className="setting-input"
                    />
                  ) : setting.type === "toggle" ? (
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={setting.value}
                        onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  ) : setting.type === "select" ? (
                    <select
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      className="setting-select"
                    >
                      {setting.options.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="settings-actions">
        <button className="save-settings-btn" onClick={handleSave}>
          💾 Save All Settings
        </button>
        <button className="reset-settings-btn" onClick={handleReset}>
          🔄 Reset to Defaults
        </button>
        <button className="export-settings-btn">
          📤 Export Settings
        </button>
      </div>

      {/* System Status */}
      <div className="system-status">
        <h2>🟢 System Status</h2>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Database:</span>
            <span className="status-value healthy">Healthy</span>
          </div>
          <div className="status-item">
            <span className="status-label">API Services:</span>
            <span className="status-value healthy">Running</span>
          </div>
          <div className="status-item">
            <span className="status-label">Last Backup:</span>
            <span className="status-value">2 hours ago</span>
          </div>
          <div className="status-item">
            <span className="status-label">Server Load:</span>
            <span className="status-value healthy">45%</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to={getDashboardRoute(user?.role)}>
          <button className="logout-btn">⬅️ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default PlatformSettings;
