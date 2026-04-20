import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Bell, Mail, Shield, Check } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [communityNotifs, setCommunityNotifs] = useState(false);
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess(true);
      setPassword({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    }, 1200);
  };

  const [deviceInfo, setDeviceInfo] = useState({ os: 'Desconhecido', browser: 'Desconhecido', isMobile: false });

  useEffect(() => {
    const parseUserAgent = () => {
      const ua = navigator.userAgent;
      let os = "Sistema Desconhecido";
      let browser = "Navegador Desconhecido";
      let isMobile = false;

      // OS detection
      if (ua.indexOf("Win") !== -1) os = "Windows";
      else if (ua.indexOf("Mac") !== -1) os = "MacOS";
      else if (ua.indexOf("X11") !== -1 || ua.indexOf("Linux") !== -1) os = "Linux";
      else if (ua.indexOf("Android") !== -1) { os = "Android"; isMobile = true; }
      else if (ua.indexOf("like Mac") !== -1) { os = "iOS"; isMobile = true; }

      // Browser detection
      if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
      else if (ua.indexOf("OPR") !== -1 || ua.indexOf("Opera") !== -1) browser = "Opera";
      else if (ua.indexOf("Trident") !== -1) browser = "Internet Explorer";
      else if (ua.indexOf("Edge") !== -1 || ua.indexOf("Edg/") !== -1) browser = "Edge";
      else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
      else if (ua.indexOf("Safari") !== -1) browser = "Safari";

      setDeviceInfo({ os, browser, isMobile });
    };
    parseUserAgent();
  }, []);

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p className="text-secondary">Manage your security, notifications, and device sessions.</p>
      </header>

      <div className="settings-layout">
        <div className="settings-main">
          <section className="settings-card glass-card">
            <div className="card-header-icon">
              <Shield size={20} className="text-primary" />
              <h3>Security & Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="settings-form">
              <div className="input-field">
                <label>Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="input-field">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="Min. 8 characters"
                    value={password.new}
                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  />
                </div>
                <div className="input-field">
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Repeat new password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isChangingPassword || !password.new}
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>

          <section className="settings-card glass-card">
            <div className="card-header-icon">
              <Bell size={20} className="text-primary" />
              <h3>Notifications</h3>
            </div>
            <div className="toggle-list">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Email Notifications</h4>
                  <p className="text-secondary">Get updates about new courses and workshops.</p>
                </div>
                <button 
                  className={`toggle-switch ${emailNotifs ? 'active' : ''}`}
                  onClick={() => setEmailNotifs(!emailNotifs)}
                >
                  <div className="switch-thumb" />
                </button>
              </div>
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Community Updates</h4>
                  <p className="text-secondary">Notifications about mentions and messages.</p>
                </div>
                <button 
                  className={`toggle-switch ${communityNotifs ? 'active' : ''}`}
                  onClick={() => setCommunityNotifs(!communityNotifs)}
                >
                  <div className="switch-thumb" />
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="settings-sidebar">
          <section className="settings-card glass-card">
            <div className="card-header-icon">
              <Monitor size={20} className="text-primary" />
              <h3>Active Session</h3>
            </div>
            <div className="device-card">
              <div className="device-icon-box">
                {deviceInfo.isMobile ? <Smartphone size={24} /> : <Monitor size={24} />}
              </div>
              <div className="device-details">
                <h4>{deviceInfo.browser} on {deviceInfo.os}</h4>
                <p className="text-primary">Online now • Current device</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
  );
};

export default Settings;
