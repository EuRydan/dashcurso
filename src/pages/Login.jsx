import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wand2, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

// Ícone Google
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Magic Link Flow States
  const [isMagicFlow, setIsMagicFlow] = useState(false);
  const [magicCodeTarget, setMagicCodeTarget] = useState('');
  const [magicCodeInput, setMagicCodeInput] = useState('');

  // Ao iniciar a tela, checar se já está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setIsMagicFlow(false);
  };

  const handleValidationSubmit = async (e, isLoginForm) => {
    e.preventDefault();
    if (isMagicFlow) return;

    setError('');
    setLoading(true);

    if (isLoginForm) {
      if (!email || !password) {
        setError('Preencha os dados obrigatórios ou use o Link Mágico.');
        setLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Email ou senha inválidos. Tente novamente.');
        setLoading(false);
      } else {
        navigate('/');
      }

    } else {
      if (!regName || !regEmail || !regPassword) {
        setError('Preencha todos os campos para prosseguir.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: {
            full_name: regName,
          }
        }
      });

      if (error) {
        setError(error.message || 'Erro ao realizar cadastro.');
        setLoading(false);
      } else {
        // Redireciona ou avisa do email de confirmação
        navigate('/');
      }
    }
  };

  // --- LOGIN: Magic Link Flow ---
  const handleMagicLinkRequest = async () => {
    setError('');
    if (!email) {
      setError('Insira o seu e-mail acima para receber o Link Mágico.');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Só permite Magic Link para quem já tem conta
        emailRedirectTo: window.location.origin,
      }
    });

    setLoading(false);
    if (error) {
      setError(error.message || 'Erro ao enviar Link Mágico.');
    } else {
      setIsMagicFlow(true);
      alert('Link Mágico e Código enviados para seu e-mail!');
    }
  };

  const handleMagicCodeValidate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: magicCodeInput,
      type: 'magiclink'
    });

    if (error) {
       setError('Código inválido ou expirado. Tente novamente.');
       setLoading(false);
    } else {
       navigate('/');
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const cancelMagicFlow = () => {
    setIsMagicFlow(false);
    setMagicCodeInput('');
    setError('');
  };

  return (
    <div className={`auth-wrapper ${isLogin ? 'is-login' : 'is-register'}`}>
      {/* Decorative background elements */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      <div className="bg-grid"></div>
      
      {/* Imagem do Painel sempre estática, nós movemos pelo CSS */}
      <div className="auth-panel image-panel">
        <div className="image-overlay">
           <div className="image-content">
              <h2>Lumen</h2>
              <p>O design minimalista que conecta você ao futuro com movimentos orgânicos e precisos.</p>
           </div>
        </div>
      </div>
      
      {/* Container dos Formulários */}
      <div className="auth-panel form-panel">
        
        {/* ======== LOGIN ======== */}
        <div className={`form-container ${isLogin ? 'active' : 'inactive'}`}>
          <div className="form-header">
            {isMagicFlow ? (
              <>
                <h1>Validar Acesso<span className="dot">.</span></h1>
                <p className="sub_desc">Insira o código de <b>6 dígitos</b> enviado para <b>{email}</b></p>
              </>
            ) : (
              <>
                <h1>Bem-vindo de volta<span className="dot">.</span></h1>
                <p className="sub_desc">Acesse sua plataforma agora.</p>
              </>
            )}
          </div>
          
          {!isMagicFlow && (
            <>
              <div className="social-auth">
                {/* Agora só com Google, usando width 100% ou flex 1 conforme CSS */}
                <button className="btn-social google-btn" onClick={handleGoogleLogin} disabled={loading}>
                  <GoogleIcon />
                  Continuar com Google
                </button>
              </div>

              <div className="divider">
                <span>Ou entre com email</span>
              </div>
            </>
          )}

          {/* Form normal de login ou form de validação de link mágico */}
          {isMagicFlow ? (
            <form onSubmit={handleMagicCodeValidate} className="auth-form magic-flow-form">
               <div className="input-group">
                <label>Código de Verificação</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="000000"
                    maxLength={6}
                    value={magicCodeInput}
                    onChange={(e) => setMagicCodeInput(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    autoFocus
                    style={{ letterSpacing: '4px', fontSize: '20px', textAlign: 'center' }}
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading || magicCodeInput.length < 6}>
                {loading ? 'Verificando...' : 'Acessar Plataforma'}
              </button>

              <button type="button" className="switch-mode-btn" onClick={cancelMagicFlow} disabled={loading}>
                Voltar ao login comum
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => handleValidationSubmit(e, true)} className="auth-form">
              <div className="input-group">
                <label>Email Corporativo</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Senha</label>
                <div className="input-wrapper">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="forgot-password">
                  <a href="#recuperar">Esqueci minha senha</a>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Acessando...' : 'Fazer Login'}
              </button>

              <button type="button" className="btn-secondary" onClick={handleMagicLinkRequest} disabled={loading}>
                <Wand2 size={16} /> Entrar usando Link Mágico
              </button>
              
              <div className="switch-mode">
                <span>É novo por aqui?</span>
                <button type="button" onClick={toggleMode} disabled={loading}>
                  Crie sua conta agora
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ======== CADASTRO ======== */}
        <div className={`form-container ${!isLogin ? 'active' : 'inactive'}`}>
          <div className="form-header">
            <h1>Crie sua Conta<span className="dot">.</span></h1>
            <p className="sub_desc">Dê o próximo passo na sua jornada.</p>
          </div>
          
          <div className="social-auth">
            <button className="btn-social google-btn" onClick={handleGoogleLogin} disabled={loading}>
              <GoogleIcon />
              Continuar com Google
            </button>
          </div>

          <div className="divider">
            <span>Ou insira os seus dados</span>
          </div>
          
          <form onSubmit={(e) => handleValidationSubmit(e, false)} className="auth-form">
            <div className="input-group">
              <label>Nome Completo</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Ex: João da Silva"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Melhor Email</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  placeholder="joao@exemplo.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Criar Senha</label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  placeholder="Crie uma senha forte"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && !isLogin && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processando dados...' : 'Criar minha conta'}
            </button>
            
            <div className="switch-mode">
              <span>Já possui uma conta?</span>
              <button type="button" onClick={toggleMode} disabled={loading}>
                Faça login para continuar
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
