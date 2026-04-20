import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wand2, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

// Ícone Google Premium
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
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMagicFlow, setIsMagicFlow] = useState(false);
  const [magicCodeInput, setMagicCodeInput] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/');
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
    setError('');
    setLoading(true);

    if (isLoginForm) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError('Acesso negado. Verifique suas credenciais.'); setLoading(false); }
      else navigate('/');
    } else {
      const { error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: { data: { full_name: regName } }
      });
      if (error) { setError(error.message); setLoading(false); }
      else navigate('/');
    }
  };

  const handleMagicLinkRequest = async () => {
    setError('');
    if (!email) { setError('Insira seu e-mail para receber o link.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin }
    });
    setLoading(false);
    if (error) setError(error.message);
    else setIsMagicFlow(true);
  };

  const handleMagicCodeValidate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: magicCodeInput, type: 'magiclink' });
    if (error) { setError('Código expirado ou inválido.'); setLoading(false); }
    else navigate('/');
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  return (
    <div className="auth-master-container">
      {/* Aurora Background Effects */}
      <div className="aurora-bg">
        <div className="aurora-element aurora-1"></div>
        <div className="aurora-element aurora-2"></div>
        <div className="aurora-element aurora-3"></div>
      </div>

      <div className={`auth-card-wrapper ${isLogin ? 'is-login' : 'is-register'}`}>
        <div className="auth-card">
          
          {/* LOGIN SECTION */}
          <div className={`auth-inner-section ${isLogin ? 'active' : 'inactive'}`}>
            <div className="auth-header">
              {isMagicFlow ? (
                <>
                  <h1>Validar Acesso<span className="dot">.</span></h1>
                  <p>Insira o código enviado para <b>{email}</b></p>
                </>
              ) : (
                <>
                  <h1>Bem-vindo<span className="dot">.</span></h1>
                  <p>Acesse sua plataforma Lumen.</p>
                </>
              )}
            </div>

            {!isMagicFlow && (
              <>
                <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
                  <GoogleIcon /> Continuar com Google
                </button>
                <div className="auth-divider"><span>ou use sua conta</span></div>
              </>
            )}

            {isMagicFlow ? (
              <form onSubmit={handleMagicCodeValidate} className="auth-form-body">
                <input 
                  type="text" 
                  className="magic-code-input"
                  placeholder="000000" 
                  maxLength={6}
                  value={magicCodeInput}
                  onChange={(e) => setMagicCodeInput(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  autoFocus
                />
                {error && <div className="auth-error"><AlertCircle size={14}/> {error}</div>}
                <button type="submit" className="btn-main" disabled={loading || magicCodeInput.length < 6}>
                  {loading ? <Loader2 className="spin" size={18}/> : 'Entrar na Plataforma'}
                </button>
                <button type="button" className="btn-text" onClick={() => setIsMagicFlow(false)}>Voltar</button>
              </form>
            ) : (
              <form onSubmit={(e) => handleValidationSubmit(e, true)} className="auth-form-body">
                <div className="auth-input-group">
                  <label>E-mail</label>
                  <input type="email" placeholder="nome@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
                </div>
                <div className="auth-input-group">
                  <div className="label-row">
                    <label>Senha</label>
                    <a href="#recuperar" className="link-small">Esqueci a senha</a>
                  </div>
                  <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                </div>
                {error && <div className="auth-error"><AlertCircle size={14}/> {error}</div>}
                <button type="submit" className="btn-main" disabled={loading}>
                  {loading ? <div className="spinner-small"></div> : 'Acessar'}
                </button>
                <button type="button" className="btn-ghost" onClick={handleMagicLinkRequest} disabled={loading}>
                  <Wand2 size={16}/> Link Mágico por E-mail
                </button>
                <div className="auth-footer">
                  Novo por aqui? <button type="button" onClick={toggleMode}>Crie sua conta</button>
                </div>
              </form>
            )}
          </div>

          {/* REGISTER SECTION */}
          <div className={`auth-inner-section ${!isLogin ? 'active' : 'inactive'}`}>
            <div className="auth-header">
              <h1>Criar Conta<span className="dot">.</span></h1>
              <p>Comece sua jornada agora mesmo.</p>
            </div>
            <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
              <GoogleIcon /> Continuar com Google
            </button>
            <div className="auth-divider"><span>ou preencha os dados</span></div>
            <form onSubmit={(e) => handleValidationSubmit(e, false)} className="auth-form-body">
              <div className="auth-input-group">
                <label>Nome Completo</label>
                <input type="text" placeholder="Seu nome" value={regName} onChange={(e) => setRegName(e.target.value)} disabled={loading}/>
              </div>
              <div className="auth-input-group">
                <label>E-mail</label>
                <input type="email" placeholder="nome@exemplo.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} disabled={loading}/>
              </div>
              <div className="auth-input-group">
                <label>Defina uma Senha</label>
                <input type="password" placeholder="Crie uma senha forte" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} disabled={loading}/>
              </div>
              {error && !isLogin && <div className="auth-error"><AlertCircle size={14}/> {error}</div>}
              <button type="submit" className="btn-main" disabled={loading}>Criar minha conta</button>
              <div className="auth-footer">
                Já tem conta? <button type="button" onClick={toggleMode}>Fazer login</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
