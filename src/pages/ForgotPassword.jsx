import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-master-container">
      <div className="forgot-card glass-card">
        <header className="forgot-header">
          <div className="icon-circle">
            <Mail size={32} color="var(--color-primary)" />
          </div>
          <h1>Recuperar Conta<span className="dot">.</span></h1>
          <p>Esqueceu sua senha? Não se preocupe, vamos te enviar um link de redefinição.</p>
        </header>

        {success ? (
          <div className="success-state-forgot">
            <CheckCircle2 size={48} color="var(--color-primary)" />
            <h3>E-mail enviado!</h3>
            <p>Confira sua caixa de entrada em <strong>{email}</strong> para continuar.</p>
            <button className="btn-vies-primary w-full" onClick={() => navigate('/login')}>
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequest} className="forgot-form">
            <div className="field-modern">
              <Mail size={18} className="field-icon-left" />
              <input 
                type="email" 
                placeholder="Seu e-mail de cadastro" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            {error && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

            <button type="submit" className="btn-vies-primary" disabled={loading}>
              {loading ? <Loader2 className="spin" size={20} /> : 'Enviar Link de Recuperação'}
            </button>

            <button type="button" className="btn-link-back" onClick={() => navigate('/login')}>
              <ArrowLeft size={16} /> Voltar para o Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
