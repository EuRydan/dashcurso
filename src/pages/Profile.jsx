import React, { useState, useRef } from 'react';
import { Camera, Edit2, Shield, Lock, ExternalLink, Save, X, Loader2 } from 'lucide-react';
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

    // Pre-check size (e.g. 2MB max for Base64 to avoid DB limits)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 2MB.');
      return;
    }

    setIsSaving(true);

    try {
      // Use standard FileReader with a Promise for cleaner async flow
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
      
      // Update local context
      await refreshUser();
    } catch (err) {
      console.error('Error updating avatar:', err);
      alert('Erro ao atualizar foto. Tente novamente com uma imagem menor.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-hero glass-card">
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateProfile();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
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
              <div className="display-name-group" onClick={() => setIsEditing(true)}>
                <h1>{user?.name || 'Alex Rivers'}</h1>
                <div className="edit-trigger visible">
                  <Edit2 size={18} />
                </div>
              </div>
            )}
            {!isEditing && <p className="status-label">{user?.status || 'Estudante'} • Desde 2026</p>}
          </div>
        </div>
      </header>

      <div className="profile-layout">
        <section className="profile-main">
          <div className="personal-info glass-card">
            <h3>Informações Pessoais</h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Nome Completo</label>
                {isEditing ? (
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="info-edit-input" />
                ) : (
                  <span>{user?.name || 'Não informado'}</span>
                )}
              </div>
              <div className="info-field">
                <label>Endereço de E-mail</label>
                <span className="read-only-email">{user?.email}</span>
              </div>
              <div className="info-field">
                <label>País / Região</label>
                {isEditing ? (
                  <input type="text" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="info-edit-input" />
                ) : (
                  <span>{user?.country || 'Brasil'}</span>
                )}
              </div>
            </div>
            {!isEditing ? (
              <button className="btn-secondary" onClick={() => setIsEditing(true)}>Editar Detalhes</button>
            ) : (
              <button className="btn-primary-mini" onClick={handleUpdateProfile} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            )}
          </div>

          <div className="security-box glass-card">
            <div className="security-text">
              <h3>Segurança</h3>
              <p className="text-secondary">Gerencie sua senha e acessos da conta.</p>
            </div>
            <button className="btn-secondary" onClick={() => window.location.href='/settings'}>Alterar Senha</button>
          </div>
        </section>

        <aside className="profile-sidebar">
          <div className="progress-card glass-card shadow-neon">
            <h3>Meu Progresso</h3>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-value">0%</span>
                <span className="stat-label">Progresso Geral</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0h</span>
                <span className="stat-label">Tempo Investido</span>
              </div>
            </div>
            <button className="btn-primary" onClick={() => window.location.href='/courses'}>Começar a Estudar</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
