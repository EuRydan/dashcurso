import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wand2, ShieldCheck, Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Rocket, CheckCircle2, RotateCcw } from 'lucide-react';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginStep, setLoginStep] = useState(0); // 0: Credenciais, 1: OTP
  const [loginOtp, setLoginOtp] = useState('');

  // Registration States
  const [regStep, setRegStep] = useState(0);
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/');
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleValidationSubmit = async (e, isLoginForm) => {
    e.preventDefault();
    console.log(`[Login] Iniciando fluxo de ${isLoginForm ? 'Login' : 'Cadastro'}...`);
    setError('');
    setLoading(true);

    try {
      if (isLoginForm) {
        if (!email || !password) throw new Error('Preencha e-mail e senha.');

        console.log('[Login] Tentando signInWithPassword...');
        const { error: signInError } = await Promise.race([
          supabase.auth.signInWithPassword({ email, password }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tempo de resposta excedido. Tente novamente.')), 8000)
          )
        ]);

        if (signInError) throw new Error('Credenciais inválidas. Verifique e tente novamente.');

        console.log('[Login] Login bem-sucedido! Redirecionando...');
        navigate('/');

      } else {
        if (!regEmail || !regPassword || !regFirstName || !regLastName) {
          throw new Error('Preencha todos os campos obrigatórios.');
        }

        console.log('[Login] Tentando signUp...');
        const { error: signUpError } = await Promise.race([
          supabase.auth.signUp({
            email: regEmail,
            password: regPassword,
            options: {
              data: {
                full_name: `${regFirstName} ${regLastName}`,
                first_name: regFirstName,
                last_name: regLastName
              }
            }
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tempo de resposta excedido. Tente novamente.')), 8000)
          )
        ]);

        if (signUpError) throw signUpError;
        console.log('[Login] Cadastro iniciado. Indo para verificação OTP.');
        setRegStep(1);
        setResendTimer(60);
      }
    } catch (err) {
      console.error('[Login] Erro:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('[Login] Fluxo finalizado.');
    }
  };

  const handleSendOtpLogin = async () => {
    if (!email) {
      setError('Insira seu e-mail para receber o código.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      console.log('[Login] Solicitando OTP para login...');
      const { error: otpError } = await Promise.race([
        supabase.auth.signInWithOtp({ 
          email,
          options: {
            shouldCreateUser: false // Só permite login para quem já tem conta
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tempo de resposta excedido.')), 8000)
        )
      ]);

      if (otpError) {
        // Se o erro for "email rate limit exceeded", avisar amigavelmente
        if (otpError.message.includes('rate limit')) {
          throw new Error('Limite de envios atingido. Aguarde 60 segundos antes de tentar novamente.');
        }
        throw new Error(otpError.message);
      }
      
      setLoginStep(1);
      setResendTimer(60);
    } catch (err) {
      setError(err.message || 'Erro inesperado ao enviar código.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordRequest = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Insira seu e-mail para receber o link de recuperação.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      console.log('[Login] Solicitando link de reset de senha...');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      alert('Link de recuperação enviado! Verifique sua caixa de entrada.');
      setLoginStep(0);
    } catch (err) {
      setError(err.message || 'Erro ao enviar link de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpLogin = async (e) => {
    if (e) e.preventDefault();
    if (loginOtp.length < 6) return;

    setError('');
    setLoading(true);
    try {
      const { error: verifyError } = await Promise.race([
        supabase.auth.verifyOtp({
          email,
          token: loginOtp,
          type: 'magiclink'
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tempo de resposta excedido.')), 8000)
        )
      ]);

      if (verifyError) throw new Error('Código inválido ou expirado.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');
    try {
      const { error: resendError } = await supabase.auth.resend({
        email: regEmail,
        type: 'signup'
      });
      if (resendError) throw resendError;
      setResendTimer(60);
      alert('Novo código enviado com sucesso!');
    } catch (err) {
      setError('Erro ao reenviar código. Tente novamente em instantes.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyRegister = async (e) => {
    if (e) e.preventDefault();
    if (regOtp.length < 6) return;

    setError('');
    setLoading(true);

    try {
      console.log('[Login] Validando OTP...');

      const { error: verifyError } = await Promise.race([
        supabase.auth.verifyOtp({
          email: regEmail,
          token: regOtp,
          type: 'signup'
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tempo de resposta excedido. Tente novamente.')), 8000)
        )
      ]);

      if (verifyError) throw verifyError;

      console.log('[Login] OTP verificado. Redirecionando...');
      setRegOtp('');
      navigate('/', { replace: true });

    } catch (err) {
      console.error('[Login] Erro na verificação OTP:', err.message);
      setError(err.message || 'Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  // FIX: handleVisitorLogin com finally para garantir que loading sempre para
  const handleVisitorLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: visitorError } = await Promise.race([
        supabase.auth.signInWithPassword({
          email: 'visitante@viesstudios.com.br',
          password: 'lumen123'
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tempo de resposta excedido.')), 8000)
        )
      ]);
      if (visitorError) throw new Error('Acesso de visitante indisponível.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // FIX: handleGoogleLogin com finally para garantir que loading sempre para
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (googleError) throw googleError;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-master-container">
      <div className={`auth-split-layout ${isLogin ? 'is-login-state' : 'is-register-state'}`}>

        {/* PAINEL VISUAL */}
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
                  {regStep === 0 ? (
                    <>
                      <h2>Sua jornada começa aqui <Sparkles size={32} /></h2>
                      <p>Crie sua conta em poucos segundos e tenha acesso ilimitado aos melhores conteúdos.</p>
                    </>
                  ) : (
                    <>
                      <h2>Quase lá! <Mail size={32} /></h2>
                      <p>Enviamos um código de verificação para o seu e-mail. Insira-o para ativar sua conta.</p>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="visual-footer">
              <div className="step-indicator">
                <div className={`step-dot ${isLogin ? 'active' : ''}`} />
                <div className={`step-dot ${!isLogin && regStep === 0 ? 'active' : ''}`} />
                <div className={`step-dot ${!isLogin && regStep === 1 ? 'active' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* FORMULÁRIOS */}
        <div className="auth-forms-container">

          {/* LOGIN */}
          <div className={`auth-form-section ${isLogin ? 'active' : 'inactive'}`}>
            <header className="form-header">
              <h1>Login<span className="dot">.</span></h1>
              <p>Insira suas credenciais de acesso</p>
            </header>

            <div className="form-body">
              {loginStep === 0 ? (
                <>
                  <button className="btn-social-outline" onClick={handleGoogleLogin} disabled={loading}>
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
                      <button 
                        type="button" 
                        className="link-subtle" 
                        onClick={() => { setLoginStep(2); setError(''); }}
                      >
                        Esqueceu a senha?
                      </button>
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
                      <button type="button" className="btn-magic" onClick={handleSendOtpLogin} disabled={loading}>
                        <Wand2 size={16} /> Link Mágico
                      </button>
                      <button type="button" className="btn-visitor-new" onClick={handleVisitorLogin} disabled={loading}>
                        <ShieldCheck size={16} /> Ver Demo
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <form onSubmit={handleVerifyOtpLogin} className="main-form">
                  <div className="otp-modern-wrapper">
                    <p className="otp-info-text text-center mb-4">Insira o código enviado para <strong>{email}</strong></p>
                    <input
                      type="text"
                      maxLength={8}
                      placeholder="00000000"
                      className="otp-field-big"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                      autoFocus
                    />
                    
                    <div className="otp-actions-row">
                      <p className="otp-hint">Não recebeu?</p>
                      <button
                        type="button"
                        className="btn-resend"
                        disabled={resendTimer > 0 || loading}
                        onClick={handleSendOtpLogin}
                      >
                        {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}
                      </button>
                    </div>
                  </div>

                  {error && isLogin && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

                  <button type="submit" className="btn-vies-primary" disabled={loading || loginOtp.length < 6}>
                    {loading ? <Loader2 className="spin" size={20} /> : (
                      <>
                        <span>Verificar e Entrar</span>
                        <CheckCircle2 size={18} />
                      </>
                    )}
                  </button>
                  <button type="button" className="btn-link-subtle w-full mt-4" onClick={() => setLoginStep(0)}>Usar senha</button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordRequest} className="main-form">
                  <header className="form-header-small">
                    <p className="text-center mb-6">Enviaremos um link de recuperação para o seu e-mail.</p>
                  </header>

                  <div className="field-modern">
                    <Mail size={18} className="field-icon-left" />
                    <input 
                      type="email" 
                      placeholder="Seu e-mail cadastrado" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>

                  {error && isLogin && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

                  <button type="submit" className="btn-vies-primary" disabled={loading}>
                    {loading ? <Loader2 className="spin" size={20} /> : (
                      <>
                        <span>Enviar Link de Recuperação</span>
                        <Mail size={18} />
                      </>
                    )}
                  </button>

                  <button 
                    type="button" 
                    className="btn-link-subtle w-full mt-4" 
                    onClick={() => { setLoginStep(0); setError(''); }}
                  >
                    Voltar para o login
                  </button>
                </form>
              )}
            </div>

            <footer className="form-footer">
              <span>Novo por aqui?</span>
              <button onClick={() => { setIsLogin(false); setError(''); setRegStep(0); }}>Criar minha conta</button>
            </footer>
          </div>

          {/* CADASTRO */}
          <div className={`auth-form-section ${!isLogin ? 'active' : 'inactive'}`}>
            <header className="form-header">
              <h1>{regStep === 0 ? 'Cadastro' : 'Verificação'}<span className="dot">.</span></h1>
              <p>{regStep === 0 ? 'Faça parte da nossa comunidade' : `Insira o código enviado para ${regEmail}`}</p>
            </header>

            <div className="form-body">
              {regStep === 0 ? (
                <>
                  <button className="btn-social-outline" onClick={handleGoogleLogin} disabled={loading}>
                    <GoogleIcon />
                    <span>Cadastrar com Google</span>
                  </button>

                  <div className="section-divider"><span>ou preencha os dados</span></div>

                  <form onSubmit={(e) => handleValidationSubmit(e, false)} className="main-form">
                    <div className="name-grid">
                      <div className="field-modern">
                        <User size={18} className="field-icon-left" />
                        <input type="text" placeholder="Nome" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} required />
                      </div>
                      <div className="field-modern">
                        <input type="text" placeholder="Sobrenome" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} required />
                      </div>
                    </div>

                    <div className="field-modern">
                      <Mail size={18} className="field-icon-left" />
                      <input type="email" placeholder="E-mail" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                    </div>
                    <div className="field-modern">
                      <Lock size={18} className="field-icon-left" />
                      <input type="password" placeholder="Defina uma senha" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                    </div>

                    {error && !isLogin && regStep === 0 && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

                    <button type="submit" className="btn-vies-primary" disabled={loading}>
                      {loading ? <Loader2 className="spin" size={20} /> : 'Continuar'}
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleVerifyRegister} className="main-form">
                  <div className="otp-modern-wrapper">
                    <input
                      type="text"
                      maxLength={8}
                      placeholder="00000000"
                      className="otp-field-big"
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                      autoFocus
                    />

                    <div className="otp-actions-row">
                      <p className="otp-hint">O código pode levar até 1 minuto.</p>
                      <button
                        type="button"
                        className="btn-resend"
                        disabled={resendTimer > 0 || resendLoading}
                        onClick={handleResendOtp}
                      >
                        {resendLoading ? <Loader2 className="spin" size={14} /> : <RotateCcw size={14} />}
                        {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}
                      </button>
                    </div>
                  </div>

                  {error && regStep === 1 && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

                  <button type="submit" className="btn-vies-primary" disabled={loading || regOtp.length < 6}>
                    {loading ? <Loader2 className="spin" size={20} /> : (
                      <>
                        <span>Finalizar Ativação</span>
                        <CheckCircle2 size={18} />
                      </>
                    )}
                  </button>
                  <button type="button" className="btn-link-subtle" onClick={() => setRegStep(0)}>Voltar para dados</button>
                </form>
              )}
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
