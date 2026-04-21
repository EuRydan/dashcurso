import React, { useState, useRef } from 'react';
import { Camera, Edit2, Shield, Lock, ExternalLink, Save, X, Loader2, LogOut, Milestone, Award, Clock } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import { supabase } from '../lib/supabase';
import './Profile.css';

const Profile = () => {
  const { user, refreshUser } = useAppContext();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newStatus, setNewStatus] = useState(user?.status || 'Estudante');
  const [newCountry, setNewCountry] = useState(user?.country || 'Brasil');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          full_name: newName,
          status: newStatus,
          country: newCountry,
          updated_at: new Date()
        });

      if (error) throw error;
      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 2MB.');
      return;
    }

    setIsSaving(true);

    try {
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          avatar_url: base64String,
          updated_at: new Date()
        });

      if (error) throw error;
      await refreshUser();
    } catch (err) {
      console.error('Error updating avatar:', err);
      alert('Erro ao atualizar foto. Tente novamente com uma imagem menor.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="profile-page">
      <header className="profile-hero-modern">
        <div className="hero-content">
          <div className="avatar-big-wrapper" onClick={handleAvatarClick}>
            <img src={user?.avatarBase64 || `https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || 'User'}&background=353534&color=A3E635&size=128`} alt="Profile" />
            <div className="btn-edit-photo-minimal">
              <Camera size={18} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>
          <div className="hero-text">
            {isEditing ? (
              <div className="edit-profile-container">
                <div className="edit-name-row">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="modern-edit-input"
                    placeholder="Nome"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button className="btn-save-glow" onClick={handleUpdateProfile} disabled={isSaving}>
                      {isSaving ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
                    </button>
                    <button className="btn-close-edit" onClick={() => setIsEditing(false)}>
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-edit-input"
                  placeholder="Seu status (ex: Estudante)"
                />
              </div>
            ) : (
              <>
                <div className="display-name-group" onClick={() => setIsEditing(true)}>
                  <h1>{user?.name || 'Alex Rivers'}</h1>
                  <div className="edit-trigger visible">
                    <Edit2 size={18} />
                  </div>
                </div>
                <div className="status-badge-row">
                   <div className="status-pill text-primary">
                      <Milestone size={14} />
                      <span>{user?.status || 'Estudante'}</span>
                   </div>
                   <div className="status-pill">
                      <Clock size={14} />
                      <span>Inscrito em Out 2023</span>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="profile-grid-layout">
        <section className="profile-col-left">
          <div className="personal-info-square glass-card">
            <div className="card-title-row">
              <h3>Informações Pessoais</h3>
              {!isEditing && <Edit2 size={18} className="icon-btn-subtle" onClick={() => setIsEditing(true)} />}
            </div>
            
            <div className="info-stack">
              <div className="info-block">
                <label>Nome Completo</label>
                {isEditing ? (
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="info-edit-input" />
                ) : (
                  <span>{user?.name || 'Não informado'}</span>
                )}
              </div>
              <div className="info-block">
                <label>Endereço de E-mail</label>
                <span className="read-only-text">{user?.email}</span>
              </div>
              <div className="info-block">
                <label>Telefone</label>
                <span className="read-only-text">+55 (00) 00000-0000</span>
              </div>
              <div className="info-block">
                <label>Organização</label>
                <span className="read-only-text">Estudante Independente</span>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-col-right">
          <div className="progress-square glass-card">
            <h3>Meu Progresso</h3>
            <div className="nested-progress-list">
              <div className="nested-item">
                <div className="nested-header">
                   <span>UI/UX Avançado</span>
                   <span className="progress-badge">Em Progresso</span>
                </div>
                <div className="nested-bar-bg">
                   <div className="nested-bar-fill" style={{ width: '65%' }} />
                </div>
                <span className="nested-label">65% Concluído</span>
              </div>

              <div className="nested-item">
                <div className="nested-header">
                   <span>Motion Design</span>
                   <span className="progress-badge">Em Progresso</span>
                </div>
                <div className="nested-bar-bg">
                   <div className="nested-bar-fill" style={{ width: '20%' }} />
                </div>
                <span className="nested-label">20% Concluído</span>
              </div>

              <div className="nested-item">
                <div className="nested-header">
                   <span>Fundamentos</span>
                   <span className="progress-badge completed">Concluído</span>
                </div>
                <div className="nested-bar-bg">
                   <div className="nested-bar-fill done" style={{ width: '100%' }} />
                </div>
                <span className="nested-label">100% Concluído</span>
              </div>
            </div>
          </div>

          <div className="security-square glass-card">
            <div className="security-content">
              <div>
                <h3>Segurança</h3>
                <p className="text-secondary-small">Gerencie sua senha e acessos da conta.</p>
              </div>
              <button className="btn-secondary-modern" onClick={() => window.location.href='/settings'}>Alterar Senha</button>
            </div>
          </div>
        </section>
      </div>

      <footer className="profile-actions-footer">
         <button className="btn-logout-link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sair da Conta</span>
         </button>
      </footer>
    </div>
  );
};

export default Profile;
