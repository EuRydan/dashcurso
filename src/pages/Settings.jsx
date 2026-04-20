import React, { useState } from 'react';
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

  return (
    <div className="page-container settings-page">
      <header className="page-header">
        <h1>Configurações</h1>
        <p className="page-subtitle">Gerencie suas preferências de segurança e notificações do sistema.</p>
      </header>

      <div className="settings-grid">
        <div className="settings-col">
          
          <section className="settings-section">
            <div className="section-header">
              <Shield size={20} className="section-icon" />
              <h3>Segurança e Senha</h3>
            </div>
            <div className="section-content">
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="input-group">
                  <label>Senha Atual</label>
                  <input 
                    type="password" 
                    value={password.current}
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Nova Senha</label>
                  <input 
                    type="password" 
                    value={password.new}
                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Confirmar Nova Senha</label>
                  <input 
                    type="password" 
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  />
                </div>
                <button 
                   type="submit" 
                   className="btn-settings-primary"
                   disabled={isChangingPassword || !password.new}
                >
                  {isChangingPassword ? 'Atualizando...' : 'Atualizar Senha'}
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
                    <p>Receber e-mails do produtor sobre o curso principal.</p>
                  </div>
                  <button 
                    className={\`toggle-btn \${emailNotifs ? 'active' : ''}\`}
                    onClick={() => setEmailNotifs(!emailNotifs)}
                  >
                    <div className="toggle-thumb"></div>
                  </button>
               </div>

               <div className="notif-item">
                  <div className="notif-info">
                    <h4>Avisos da Comunidade</h4>
                    <p>Receber resumos diários de interações na comunidade.</p>
                  </div>
                  <button 
                    className={\`toggle-btn \${communityNotifs ? 'active' : ''}\`}
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
              <h3>Dispositivos Ativos</h3>
            </div>
            <p className="section-desc">Seus dispositivos conectados recentemente na plataforma.</p>
            
            <div className="device-list">
              <div className="device-item active-device">
                <div className="device-icon">
                  <Monitor size={24} />
                </div>
                <div className="device-info">
                  <h4>Chrome no Windows</h4>
                  <span>Atual (Este dispositivo) • São Paulo, BR</span>
                </div>
              </div>

              <div className="device-item">
                <div className="device-icon">
                  <Smartphone size={24} />
                </div>
                <div className="device-info">
                  <h4>Safari no iPhone 13</h4>
                  <span>Último acesso: há 3 horas • Rio de Janeiro, BR</span>
                </div>
                <button className="btn-disconnect">Desconectar</button>
              </div>

              <div className="device-item">
                <div className="device-icon">
                  <Monitor size={24} />
                </div>
                <div className="device-info">
                  <h4>Edge no Mac</h4>
                  <span>Último acesso: 12 de Out • Curitiba, BR</span>
                </div>
                <button className="btn-disconnect">Desconectar</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
