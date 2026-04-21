import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wand2, ShieldCheck, Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Rocket } from 'lucide-react';
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
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw new Error('Credenciais inválidas. Tente novamente.');
        navigate('/');
      } else {
        if (!regEmail || !regPassword || !regName) throw new Error('Preencha todos os campos.');
        const { error: signUpError } = await supabase.auth.signUp({
          email: regEmail,
          password: regPassword,
          options: { data: { full_name: regName } }
        });
        if (signUpError) throw signUpError;
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
    const { error: visitorError } = await supabase.auth.signInWithPassword({ 
      email: 'visitante@lumen.com.br', 
      password: 'lumen123' 
    });
    if (visitorError) {
      setError('Acesso de visitante indisponível.');
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (googleError) { setError(googleError.message); setLoading(false); }
  };

  return (
    <div className="auth-master-container">
      <div className={`auth-split-layout ${isLogin ? 'is-login-state' : 'is-register-state'}`}>
        
        {/* PAINEL VISUAL (SLIDING) */}
        <div className="auth-visual-panel">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="brand-badge">Vies Experience</div>
            <div className="text-anim-group">
              {isLogin ? (
                <>
                  <h2>Bom te ver de volta! <Rocket size={32} /></h2>
                  <p>Acesse seu painel e continue sua jornada de aprendizado de onde parou.</p>
                </>
              ) : (
                <>
                  <h2>Sua jornada começa aqui <Sparkles size={32} /></h2>
                  <p>Crie sua conta em poucos segundos e tenha acesso ilimitado aos melhores conteúdos.</p>
                </>
              )}
            </div>
            
            <div className="visual-footer">
              <div className="step-indicator">
                <div className={`step-dot ${isLogin ? 'active' : ''}`} />
                <div className={`step-dot ${!isLogin ? 'active' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* CONTAINER DE FORMULÁRIOS */}
        <div className="auth-forms-container">
          
          {/* LOGIN FORM */}
          <div className={`auth-form-section ${isLogin ? 'active' : 'inactive'}`}>
            <header className="form-header">
               <h1>Login<span className="dot">.</span></h1>
               <p>Insira suas credenciais de acesso</p>
            </header>

            <div className="form-body">
               <button className="btn-social-outline" onClick={handleGoogleLogin}>
                  <GoogleIcon />
                  <span>Google</span>
               </button>

               <div className="section-divider"><span>ou use seu e-mail</span></div>

               <form onSubmit={(e) => handleValidationSubmit(e, true)} className="main-form">
                  <div className="field-modern">
                     <Mail size={18} className="field-icon-left" />
                     <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="field-modern">
                     <Lock size={18} className="field-icon-left" />
                     <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Senha" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                     />
                     <button type="button" className="field-icon-right" onClick={() => setShowPassword(!showPassword)}>
                       {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                  </div>

                  <div className="form-links">
                     <a href="#reset" className="link-subtle">Esqueceu a senha?</a>
                  </div>

                  {error && isLogin && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

                  <button type="submit" className="btn-vies-primary" disabled={loading}>
                    {loading ? <Loader2 className="spin" size={20} /> : (
                      <>
                        <span>Acessar</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="alternative-entry">
                     <button type="button" className="btn-magic" onClick={() => setIsMagicFlow(true)}>
                        <Wand2 size={16} /> Link Mágico
                     </button>
                     <button type="button" className="btn-visitor-new" onClick={handleVisitorLogin}>
                        <ShieldCheck size={16} /> Ver Demo
                     </button>
                  </div>
               </form>
            </div>

            <footer className="form-footer">
               <span>Novo por aqui?</span>
               <button onClick={() => { setIsLogin(false); setError(''); }}>Criar minha conta</button>
            </footer>
          </div>

          {/* REGISTER FORM */}
          <div className={`auth-form-section ${!isLogin ? 'active' : 'inactive'}`}>
            <header className="form-header">
               <h1>Cadastro<span className="dot">.</span></h1>
               <p>Faça parte da nossa comunidade</p>
            </header>

            <div className="form-body">
              <form onSubmit={(e) => handleValidationSubmit(e, false)} className="main-form">
                <div className="field-modern">
                   <User size={18} className="field-icon-left" />
                   <input type="text" placeholder="Nome completo" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                </div>
                <div className="field-modern">
                   <Mail size={18} className="field-icon-left" />
                   <input type="email" placeholder="E-mail" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="field-modern">
                   <Lock size={18} className="field-icon-left" />
                   <input type="password" placeholder="Defina uma senha" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                </div>

                {error && !isLogin && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

                <button type="submit" className="btn-vies-primary" disabled={loading}>
                   {loading ? <Loader2 className="spin" size={20} /> : 'Finalizar Cadastro'}
                </button>
              </form>
            </div>

            <footer className="form-footer">
               <span>Já possui conta?</span>
               <button onClick={() => { setIsLogin(true); setError(''); }}>Fazer login</button>
            </footer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
