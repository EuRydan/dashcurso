import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Github, Chrome, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('O e-mail é obrigatório para acessar a plataforma.');
      return;
    }
    
    // Simple email regex for visual feedback
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Parece que o formato do e-mail está incorreto.');
      return;
    }

    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      // Let's pretend the user sent the magic link but we will just redirect them for the demo
      navigate('/');
    }, 1500);
  };

  const handleSocialLogin = () => {
    setLoading(true);
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div className="login-page">
      <div className="ambient-glow login-glow"></div>
      
      <div className="login-card glass">
        <div className="login-header">
          <div className="brand-logo">
             <div className="badge-glow small-glow"></div>
             <span>Lumen</span>
          </div>
          <h1>Bem-vindo de volta!</h1>
          <p>Acesse seu painel para continuar aprendendo.</p>
        </div>

        <div className="social-login">
          <button className="btn-social" onClick={handleSocialLogin} disabled={loading}>
            <Chrome size={20} />
            Entrar com Google
          </button>
          <button className="btn-social" onClick={handleSocialLogin} disabled={loading}>
            <Github size={20} />
            Entrar com Github
          </button>
        </div>

        <div className="divider-wrapper">
          <div className="divider-line"></div>
          <span className="divider-text">ou use um Magic Link</span>
          <div className="divider-line"></div>
        </div>

        <form className="login-form" onSubmit={handleMagicLink}>
          <div className="input-group">
            <label htmlFor="email">E-mail de acesso</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                id="email"
                type="email" 
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Receber link mágico'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
