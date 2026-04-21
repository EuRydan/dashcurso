import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit2, Loader2, LogOut, Milestone, Clock, Mail, Save, X, Shield, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import { supabase } from '../lib/supabase';
import './Profile.css';

const PRESET_CATEGORIES = [
  'Estudante',
  'Designer Gráfico',
  'Designer UI/UX',
  'Web Designer',
  'Motion Designer',
  'Desenvolvedor Front-end',
  'Desenvolvedor Back-end',
  'Desenvolvedor Full-stack',
  'Desenvolvedor Mobile',
  'Engenheiro de Software',
  'Arquiteto de Software',
  'DevOps Engineer',
  'Social Media',
  'Copywriter',
  'Gestor de Tráfego',
  'Analista de SEO',
  'Marketing Digital',
  'Editor de Vídeo',
  'Filmmaker',
  'Fotógrafo',
  'Ilustrador',
  'Empreendedor',
  'Freelancer',
  'Consultor',
  'Publicitário',
  'Jornalista',
  'Relações Públicas',
  'Data Scientist',
  'Analista de Dados',
  'Product Manager',
  'Community Manager',
  'Assistente Virtual'
].sort();

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAppContext();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusSearch, setStatusSearch] = useState('');

  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [newFullName, setNewFullName] = useState(user?.full_name || '');
  const [newStatus, setNewStatus] = useState(user?.status || 'Estudante');
  const [newCountry, setNewCountry] = useState(user?.country || 'Brasil');
  const [newPhone, setNewPhone] = useState(user?.phone || '');

  const [isSaving, setIsSaving] = useState(false);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtro de categorias
  const filteredCategories = PRESET_CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(statusSearch.toLowerCase())
  );

  // Sincroniza estados locais quando dados globais mudam (após refresh)
  React.useEffect(() => {
    if (!isEditingHeader && !isEditingInfo) {
      setNewNickname(user?.nickname || '');
      setNewFullName(user?.full_name || '');
      setNewStatus(user?.status || 'Estudante');
      setNewCountry(user?.country || 'Brasil');
      setNewPhone(user?.phone || '');
    }
  }, [user, isEditingHeader, isEditingInfo]);

  // Email Change State
  const [emailModalStep, setEmailModalStep] = useState(0);
  const [tempEmail, setTempEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleUpdateProfile = async (target) => {
    console.log('[Profile] Iniciando salvamento:', target);
    setIsSaving(true);
    setShowStatusDropdown(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newFullName,
          status: newStatus,
          country: newCountry,
          nickname: newNickname,
          phone: newPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      console.log('[Profile] Salvo com sucesso!');

      // FIX: sem await — refresh em background sem bloquear a UI
      if (refreshUser) {
        refreshUser().catch(err =>
          console.warn('[Profile] refreshUser falhou:', err.message)
        );
      }

      // FIX: só fecha o modo de edição correto
      if (target === 'header') setIsEditingHeader(false);
      if (target === 'info') setIsEditingInfo(false);

    } catch (err) {
      console.error('[Profile] Erro fatal:', err);
      alert('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setIsSaving(false);
      console.log('[Profile] Ciclo de salvamento finalizado.');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande. Escolha uma de até 2MB.');
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

      // FIX: usa update em vez de upsert para consistência
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: base64String,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      refreshUser().catch(err => console.warn('[Profile] refreshUser falhou:', err.message));
    } catch (err) {
      console.error('Erro ao atualizar avatar:', err);
      alert('Erro ao atualizar foto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const startEmailChange = async () => {
    if (!tempEmail || tempEmail === user.email) {
      setEmailError('Insira um novo endereço de e-mail válido.');
      return;
    }
    setIsSaving(true);
    setEmailError('');
    try {
      const { error } = await supabase.auth.updateUser({ email: tempEmail });
      if (error) throw error;
      setEmailModalStep(2);
    } catch (err) {
      setEmailError(err.message || 'Erro ao iniciar troca de e-mail.');
    } finally {
      setIsSaving(false);
    }
  };

  const verifyEmailCode = async () => {
    if (otpToken.length !== 6) {
      setEmailError('O código deve ter 6 dígitos.');
      return;
    }
    setIsSaving(true);
    setEmailError('');
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: tempEmail,
        token: otpToken,
        type: 'email_change'
      });
      if (error) throw error;

      await refreshUser();
      setEmailModalStep(0);
      setTempEmail('');
      setOtpToken('');
      alert('E-mail atualizado com sucesso!');
    } catch (err) {
      setEmailError('Código inválido ou expirado.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      {/* MODAL DE EMAIL */}
      {emailModalStep > 0 && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <header className="modal-header">
              <h3>Alterar E-mail</h3>
              <button className="btn-close" onClick={() => setEmailModalStep(0)}><X size={20} /></button>
            </header>

            <div className="modal-body">
              {emailModalStep === 1 ? (
                <>
                  <p className="modal-desc">Insira seu novo e-mail. Enviaremos um código de 6 dígitos para confirmação.</p>
                  <div className="input-group-modern">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      placeholder="Novo e-mail"
                      value={tempEmail}
                      autoComplete="off"
                      onChange={(e) => setTempEmail(e.target.value)}
                    />
                  </div>
                  {emailError && <span className="error-text">{emailError}</span>}
                  <button className="btn-primary w-full mt-4" onClick={startEmailChange} disabled={isSaving}>
                    {isSaving ? <Loader2 className="spin" size={20} /> : 'Enviar Código'}
                  </button>
                </>
              ) : (
                <>
                  <p className="modal-desc">Enviamos um código para <strong>{tempEmail}</strong>. Insira-o abaixo:</p>
                  <div className="otp-container">
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="000000"
                      className="otp-input"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  {emailError && <span className="error-text">{emailError}</span>}
                  <button className="btn-primary w-full mt-4" onClick={verifyEmailCode} disabled={isSaving}>
                    {isSaving ? <Loader2 className="spin" size={20} /> : 'Verificar e Salvar'}
                  </button>
                  <button className="btn-ghost w-full mt-2" onClick={() => setEmailModalStep(1)}>Voltar</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="profile-hero-modern">
        <div className="hero-content">
          <div className="avatar-big-wrapper" onClick={handleAvatarClick}>
            <img
              src={user?.avatarBase64 || `https://ui-avatars.com/api/?name=${user?.nickname?.replace(' ', '+') || 'User'}&background=353534&color=A3E635&size=128`}
              alt="Profile"
            />
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
            {isEditingHeader ? (
              <div className="edit-profile-header-card glass-card">
                <div className="edit-header-row">
                  <div className="header-input-group">
                    <label>Apelido</label>
                    <input
                      type="text"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      className="header-edit-input"
                      placeholder="Ex: Ryanzin"
                      autoFocus
                    />
                  </div>
                  
                  <div className="header-input-group" ref={dropdownRef}>
                    <label>Status</label>
                    <div className="searchable-select-container">
                      <input
                        type="text"
                        value={showStatusDropdown ? statusSearch : newStatus}
                        onChange={(e) => {
                          setStatusSearch(e.target.value);
                          if (!showStatusDropdown) setShowStatusDropdown(true);
                        }}
                        onFocus={() => {
                          setShowStatusDropdown(true);
                          setStatusSearch('');
                        }}
                        className="header-edit-input"
                        placeholder="Pesquisar categoria..."
                      />
                      
                      {showStatusDropdown && (
                        <div className="categories-dropdown glass-card">
                          <div className="categories-list">
                            {filteredCategories.length > 0 ? (
                              filteredCategories.map(cat => (
                                <div 
                                  key={cat} 
                                  className={`category-item ${newStatus === cat ? 'active' : ''}`}
                                  onClick={() => {
                                    setNewStatus(cat);
                                    setShowStatusDropdown(false);
                                  }}
                                >
                                  {cat}
                                  {newStatus === cat && <CheckCircle2 size={14} />}
                                </div>
                              ))
                            ) : (
                              <div className="no-results">Nenhuma profissão encontrada.</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="header-edit-actions">
                  <button className="btn-save-minimal" onClick={() => handleUpdateProfile('header')} disabled={isSaving}>
                    {isSaving ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
                    <span>Salvar</span>
                  </button>
                  <button className="btn-cancel-minimal" onClick={() => {
                    setIsEditingHeader(false);
                    setShowStatusDropdown(false);
                  }}>
                    <X size={16} />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="display-name-group" onClick={() => setIsEditingHeader(true)}>
                  <h1>{user?.nickname || 'Usuário'}</h1>
                  <div className="edit-trigger visible">
                    <Edit2 size={18} />
                  </div>
                </div>
                <div className="status-badge-row">
                  <div className="status-pill tag-mode">
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
              {!isEditingInfo && <Edit2 size={18} className="icon-btn-subtle" onClick={() => setIsEditingInfo(true)} />}
              {isEditingInfo && (
                <div className="card-actions-row">
                  <button className="btn-save-small" onClick={() => handleUpdateProfile('info')} disabled={isSaving}>
                    {isSaving ? <Loader2 className="spin" size={14} /> : <Save size={14} />}
                  </button>
                  <button className="btn-cancel-small" onClick={() => setIsEditingInfo(false)}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="info-stack">
              <div className="info-block">
                <label>Nome Completo</label>
                {isEditingInfo ? (
                  <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} className="info-edit-input" placeholder="Seu nome real" />
                ) : (
                  <span>{user?.full_name || 'Não informado'}</span>
                )}
              </div>

              <div className="info-block">
                <label>Endereço de E-mail</label>
                <div className="email-display-row">
                  <span className="read-only-text">{user?.email}</span>
                  {isEditingInfo && (
                    <button className="btn-change-email" onClick={() => setEmailModalStep(1)}>Alterar</button>
                  )}
                </div>
              </div>

              <div className="info-block">
                <label>Telefone</label>
                {isEditingInfo ? (
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="info-edit-input" placeholder="+55 (00) 00000-0000" />
                ) : (
                  <span>{user?.phone || '+55 (00) 00000-0000'}</span>
                )}
              </div>

              <div className="info-block">
                <label>País / Região</label>
                {isEditingInfo ? (
                  <input type="text" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="info-edit-input" placeholder="Brasil" />
                ) : (
                  <span>{user?.country || 'Brasil'}</span>
                )}
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
            <div className="empty-state-minimal-v2">
              <div className="empty-progress-border" />
              <p className="text-secondary-small">O acompanhamento de progresso das suas trilhas aparecerá aqui assim que você iniciar o primeiro módulo.</p>
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
