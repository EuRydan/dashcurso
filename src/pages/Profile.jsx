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
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          full_name: newName,
          updated_at: new Date()
        });

      if (error) throw error;
      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating name:', err);
      alert('Erro ao atualizar nome.');
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

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      setIsSaving(true);
      try {
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
        alert('Erro ao atualizar foto.');
      } finally {
        setIsSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">
      <header className="profile-hero glass-card">
        <div className="hero-content">
          <div className="avatar-big-wrapper" onClick={handleAvatarClick}>
            <img src={user?.avatarBase64 || `https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || 'User'}&background=353534&color=A3E635&size=128`} alt="Profile" />
            <div className="btn-edit-photo">
              <Camera size={16} />
              <span>Alterar Foto</span>
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
              <div className="edit-name-group">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="edit-input"
                  autoFocus
                />
                <button className="btn-save-mini" onClick={handleUpdateName} disabled={isSaving}>
                  {isSaving ? <Loader2 className="spin" size={14} /> : <Save size={14} />}
                </button>
                <button className="btn-cancel-mini" onClick={() => setIsEditing(false)}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="display-name-group" onClick={() => setIsEditing(true)}>
                <h1>{user?.name || 'Alex Rivers'}</h1>
                <Edit2 size={16} className="text-secondary" />
              </div>
            )}
            <p className="text-secondary">Estudante • Desde 2026</p>
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
                <span>{user?.name || 'Não informado'}</span>
              </div>
              <div className="info-field">
                <label>Endereço de E-mail</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-field">
                <label>País / Região</label>
                <span>Brasil</span>
              </div>
            </div>
            <button className="btn-secondary" onClick={() => setIsEditing(true)}>Editar Detalhes</button>
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
