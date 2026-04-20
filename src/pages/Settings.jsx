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
    <div className="page-container settings-page">
      <header className="page-header">
        <h1>Configurações</h1>
        <p className="page-subtitle">Gerencie suas preferências de segurança e notificações do sistema.</p>
      </header>

      <div className="settings-grid-professional">
        <div className="settings-col">
          
          <section className="settings-section">
            <div className="section-header">
              <Shield size={20} className="section-icon" />
              <h3>Segurança e Senha</h3>
            </div>
            <div className="section-content">
              <form onSubmit={handlePasswordSubmit} className="password-form-clean">
                <div className="form-row">
                  <div className="input-field">
                    <label>Senha Atual</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password.current}
                      onChange={(e) => setPassword({ ...password, current: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row dual">
                  <div className="input-field">
                    <label>Nova Senha</label>
                    <input 
                      type="password" 
                      placeholder="Mínimo 8 caracteres"
                      value={password.new}
                      onChange={(e) => setPassword({ ...password, new: e.target.value })}
                    />
                  </div>
                  <div className="input-field">
                    <label>Confirmar Senha</label>
                    <input 
                      type="password" 
                      placeholder="Repita a nova senha"
                      value={password.confirm}
                      onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                   type="submit" 
                   className="btn-settings-primary"
                   disabled={isChangingPassword || !password.new}
                >
                  {isChangingPassword ? 'Atualizando...' : 'Salvar Alterações'}
                </button>
                {passwordSuccess && (
                  <div className="success-msg">
                    <Check size={16} /> Senha atualizada com sucesso.
                  </div>
                )}
              </form>
            </div>
          </section>

          <section className="settings-section">
             <div className="section-header">
              <Bell size={20} className="section-icon" />
              <h3>Notificações</h3>
            </div>
            <div className="section-content notif-list">
               <div className="notif-item">
                  <div className="notif-info">
                    <h4>Novas Aulas e Atualizações</h4>
                    <p>Receber e-mails sobre novos conteúdos.</p>
                  </div>
                  <button 
                    className={'toggle-btn ' + (emailNotifs ? 'active' : '')}
                    onClick={() => setEmailNotifs(!emailNotifs)}
                  >
                    <div className="toggle-thumb"></div>
                  </button>
               </div>

               <div className="notif-item">
                  <div className="notif-info">
                    <h4>Avisos da Comunidade</h4>
                    <p>Resumos diários de interações.</p>
                  </div>
                  <button 
                    className={'toggle-btn ' + (communityNotifs ? 'active' : '')}
                    onClick={() => setCommunityNotifs(!communityNotifs)}
                  >
                    <div className="toggle-thumb"></div>
                  </button>
               </div>
            </div>
          </section>

        </div>

        <div className="settings-col">
          <section className="settings-section">
            <div className="section-header">
              <Monitor size={20} className="section-icon" />
              <h3>Sessão Atual</h3>
            </div>
            <p className="section-desc-clean">Dispositivo identificado pelo sistema Lumen.</p>
            
            <div className="device-list">
              <div className="device-item active-device">
                <div className="device-icon">
                  {deviceInfo.isMobile ? <Smartphone size={24} /> : <Monitor size={24} />}
                </div>
                <div className="device-info">
                  <h4>{deviceInfo.browser} / {deviceInfo.os}</h4>
                  <span>Online agora • Este dispositivo</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
