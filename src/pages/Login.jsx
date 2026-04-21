import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wand2, ShieldCheck, Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Auth Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMagicFlow, setIsMagicFlow] = useState(false);
  const [magicCodeInput, setMagicCodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/');
    };
    checkUser();
  }, [navigate]);

  const handleValidationSubmit = async (e, isLoginForm) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginForm) {
        if (!email || !password) throw new Error('Preencha e-mail e senha.');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error('Credenciais inválidas. Tente novamente.');
        navigate('/');
      } else {
        if (!regEmail || !regPassword || !regName) throw new Error('Preencha todos os campos.');
        const { error } = await supabase.auth.signUp({
          email: regEmail,
          password: regPassword,
          options: { data: { full_name: regName } }
        });
        if (error) throw error;
        alert('Conta criada! Verifique seu e-mail para confirmar o acesso.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitorLogin = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email: 'visitante@lumen.com.br', 
      password: 'lumen123' 
    });
    if (error) {
      setError('Acesso de visitante indisponível no momento.');
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="auth-master-container">
      <div className="auth-card-wrapper">
        <div className="auth-card glass-premium">
          <header className="auth-header-new">
             <div className="logo-placeholder">L</div>
             <h1>{isLogin ? (isMagicFlow ? 'Validar Acesso' : 'Bem-vindo') : 'Criar Conta'}<span className="dot">.</span></h1>
             <p>{isLogin ? 'Inicie sua jornada na plataforma Lumen' : 'Preencha os dados para começar'}</p>
          </header>

          <div className="auth-content-flow">
            {isLogin ? (
              // LOGIN CONTENT
              isMagicFlow ? (
                <form onSubmit={(e) => e.preventDefault()} className="auth-form-modern">
                  <div className="magic-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="000000" 
                      maxLength={6}
                      value={magicCodeInput}
                      onChange={(e) => setMagicCodeInput(e.target.value.replace(/\D/g, ''))}
                      className="magic-field"
                      autoFocus
                    />
                    <p className="hint">Enviamos um código para seu e-mail</p>
                  </div>
                  <button type="submit" className="btn-primary-new" disabled={loading || magicCodeInput.length < 6}>
                    {loading ? <Loader2 className="spin" size={20} /> : 'Confirmar Código'}
                  </button>
                  <button type="button" className="btn-link" onClick={() => setIsMagicFlow(false)}>Voltar ao login comum</button>
                </form>
              ) : (
                <>
                  <button className="btn-social" onClick={handleGoogleLogin}>
                    <GoogleIcon />
                    <span>Entrar com Google</span>
                  </button>

                  <div className="separator"><span>ou use seu e-mail</span></div>

                  <form onSubmit={(e) => handleValidationSubmit(e, true)} className="auth-form-modern">
                    <div className="input-field-new">
                       <Mail size={18} className="field-icon" />
                       <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="input-field-new">
                       <Lock size={18} className="field-icon" />
                       <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Senha" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                       />
                       <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                    </div>

                    <div className="form-utils">
                       <a href="#reset" className="link-muted">Esqueceu a senha?</a>
                    </div>

                    {error && <div className="error-badge"><AlertCircle size={14} /> {error}</div>}

                    <button type="submit" className="btn-primary-new" disabled={loading}>
                      {loading ? <Loader2 className="spin" size={20} /> : (
                        <>
                          <span>Acessar</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    <div className="secondary-actions">
                       <button type="button" className="btn-subtle" onClick={() => setIsMagicFlow(true)}>
                          <Wand2 size={16} /> Link Mágico
                       </button>
                       <button type="button" className="btn-subtle visitor" onClick={handleVisitorLogin}>
                          <ShieldCheck size={16} /> Visitante
                       </button>
                    </div>
                  </form>
                </>
              )
            ) : (
              // REGISTER CONTENT
              <form onSubmit={(e) => handleValidationSubmit(e, false)} className="auth-form-modern">
                <div className="input-field-new">
                   <User size={18} className="field-icon" />
                   <input type="text" placeholder="Nome completo" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                </div>
                <div className="input-field-new">
                   <Mail size={18} className="field-icon" />
                   <input type="email" placeholder="E-mail" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="input-field-new">
                   <Lock size={18} className="field-icon" />
                   <input type="password" placeholder="Defina uma senha" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                </div>

                {error && <div className="error-badge"><AlertCircle size={14} /> {error}</div>}

                <button type="submit" className="btn-primary-new" disabled={loading}>
                   {loading ? <Loader2 className="spin" size={20} /> : 'Criar minha conta'}
                </button>
              </form>
            )}
          </div>

          <footer className="auth-footer-new">
             {isLogin ? (
               <p>Não tem conta? <button onClick={() => { setIsLogin(false); setError(''); }}>Registre-se Gratuitamente</button></p>
             ) : (
               <p>Já possui conta? <button onClick={() => { setIsLogin(true); setError(''); }}>Fazer Login</button></p>
             )}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
