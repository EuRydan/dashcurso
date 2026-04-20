import React, { useState, useRef, useEffect } from 'react';
import { Camera, Edit2, CheckCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import { supabase } from '../lib/supabase';
import './Profile.css';

const Profile = () => {
  const fileInputRef = useRef(null);
  const { user, refreshUser } = useAppContext();
  
  const [avatar, setAvatar] = useState(user?.avatarBase64 || `https://ui-avatars.com/api/?name=${(user?.name || 'A').replace(' ', '+')}&background=353534&color=A3E635&size=128`);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    org: 'Independent Scholar'
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({...prev, name: user.name, email: user.email}));
      if (user.avatarBase64) setAvatar(user.avatarBase64);
    }
  }, [user]);
  
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) errorMsg = 'E-mail inválido';
    }
    if (name === 'phone') {
      // Very basic length validation for demo
      if (value.length < 8) errorMsg = 'Telefone muito curto';
    }
    if (name === 'name' && value.trim() === '') {
      errorMsg = 'O nome não pode ficar vazio';
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSave = async () => {
    // Validate all
    let hasError = false;
    const newErrors = {};
    Object.keys(form).forEach(key => {
      if (key === 'name' || key === 'email') {
        const err = validateField(key, form[key]);
        if (err) {
          hasError = true;
          newErrors[key] = err;
        }
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.name })
      .eq('id', user.id);

    if (error) {
      alert('Erro ao salvar no banco: ' + error.message);
    } else {
      await refreshUser();
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    
    setIsSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); // Pré visualização instantânea
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Upload para o Storage (Criar bucket 'avatars' se não existir manualmente ou via SQL)
      // Nota: O bucket precisa ser público para download direto aqui
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        alert('Erro ao subir imagem: ' + uploadError.message + '. Garanta que o bucket "avatars" existe e é público.');
        return;
      }

      // 2. Pegar URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Atualizar Perfil no Banco
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        alert('Erro ao atualizar link no perfil: ' + updateError.message);
      } else {
        setAvatar(publicUrl);
        await refreshUser();
      }
    }
  };

  return (
    <div className="page-container profile-page">
      <header className="profile-header">
        <div className="profile-header-left">
          <div className="avatar-wrapper">
             <img src={avatar} alt="User Avatar" />
             <button className="btn-edit-avatar" onClick={handleAvatarClick}>
               <Camera size={14} />
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               style={{ display: 'none' }}
               accept="image/*"
               onChange={handleAvatarChange}
             />
          </div>
          <div className="profile-header-info">
            <h2>{form.name}</h2>
            <div className="profile-badges">
              <span className="badge">Student</span>
              <span className="bullet">•</span>
              <span className="badge">Enrolled since Oct 2023</span>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <div className="profile-col-left">
          <section className="profile-section info-section">
            <div className="section-header">
              <h3>Informações Pessoais</h3>
              {!isEditing && (
                <button className="btn-icon" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Nome Completo</span>
                {isEditing ? (
                  <>
                    <input name="name" value={form.name} onChange={handleChange} className={'profile-input ' + (errors.name ? 'error' : '')} />
                    {errors.name && <span className="input-error">{errors.name}</span>}
                  </>
                ) : (
                  <span className="info-value">{form.name}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Endereço de E-mail</span>
                {isEditing ? (
                   <>
                    <input name="email" value={form.email} onChange={handleChange} className={'profile-input ' + (errors.email ? 'error' : '')} />
                    {errors.email && <span className="input-error">{errors.email}</span>}
                  </>
                ) : (
                  <span className="info-value">{form.email}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Número de Telefone</span>
                {isEditing ? (
                  <>
                    <input name="phone" value={form.phone} onChange={handleChange} className={'profile-input ' + (errors.phone ? 'error' : '')} />
                    {errors.phone && <span className="input-error">{errors.phone}</span>}
                  </>
                ) : (
                  <span className="info-value">{form.phone}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Organização</span>
                {isEditing ? (
                  <input name="org" value={form.org} onChange={handleChange} className="profile-input" />
                ) : (
                  <span className="info-value">{form.org}</span>
                )}
              </div>
            </div>

            {(isEditing || saveSuccess) && (
              <div className="profile-actions">
                {isEditing && (
                  <button 
                    className="btn-settings-primary" 
                    onClick={handleSave} 
                    disabled={isSaving || Object.values(errors).some(e => e)}
                  >
                    {isSaving ? <><Loader2 className="spin" size={16}/> Salvando...</> : 'Salvar Alterações'}
                  </button>
                )}
                {saveSuccess && (
                  <div className="success-msg">
                    <CheckCircle size={18} /> Alterações salvas com sucesso!
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="profile-col-right">
          {/* Progress Section... (same as before) */}
          <section className="profile-section progress-section">
            <h3>Meu Progresso</h3>
            
            <div className="progress-items" style={{ alignItems: 'center', textAlign: 'center', padding: '32px 0' }}>
              <div className="empty-icon-box" style={{ width: 48, height: 48, marginBottom: 16 }}>
                 <CheckCircle size={24} color="var(--color-text-secondary)" />
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Nenhuma aula iniciada</h4>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
                Seu progresso aparecerá aqui assim que você iniciar o primeiro módulo dos seus cursos.
              </p>
            </div>
          </section>

          <section className="profile-section security-section">
            <div className="security-info">
               <div className="security-text">
                 <h4>Segurança e Configurações</h4>
                 <p>Gerencie sua senha em Configurações.</p>
               </div>
               {/* Just a mock link to our new settings page */}
               <button className="btn-secondary" onClick={() => window.location.href = '/settings'}>Acessar Configs</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
