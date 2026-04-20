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
    <div className="page-container profile-page">
      <header className="profile-header">
        <div className="profile-header-left">
          <div className="avatar-wrapper" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
             <img src={user?.avatarBase64 || `https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || 'User'}&background=353534&color=A3E635&size=128`} alt={user?.name} />
             <div className="avatar-overlay">
                <Camera size={20} />
             </div>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
             />
          </div>
          <div className="profile-header-info">
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
                <h2>{user?.name || 'Estudante'}</h2>
                <Edit2 size={14} className="edit-icon-hint" />
              </div>
            )}
            <div className="profile-badges">
              <span className="badge">Membro Premium</span>
              <span className="bullet">•</span>
              <span className="badge">Desde 2024</span>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <div className="profile-col-left">
          <section className="profile-section info-section">
            <div className="section-header">
              <h3>Informações Pessoais</h3>
              <button className="btn-icon" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
              </button>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Nome Completo</span>
                <span className="info-value">{user?.name || 'Não definido'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">E-mail</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status da Conta</span>
                <span className="info-value">Ativo</span>
              </div>
            </div>
          </section>
        </div>

        <div className="profile-col-right">
          <section className="profile-section progress-section-empty">
            <h3>Meu Progresso</h3>
            <div className="empty-progress-msg">
              <Award size={24} />
              <p>Inicie um curso para ver seu progresso detalhado aqui.</p>
            </div>
          </section>

          <section className="profile-section security-section">
            <div className="security-info">
               <div className="security-text">
                 <h4>Segurança</h4>
                 <p>Gerencie sua senha e acessos.</p>
               </div>
               <button className="btn-secondary" onClick={() => window.location.href='/settings'}>Mudar Senha</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
