import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verifica se há uma sessão ativa (iniciada pelo link do e-mail)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Sessão expirada ou link inválido. Solicite uma nova recuperação.');
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      // Após 3 segundos redireciona para login
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Erro ao atualizar senha.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reset-container">
        <div className="reset-card glass-card success-state">
          <div className="success-icon">
            <CheckCircle2 size={64} color="var(--color-primary)" />
          </div>
          <h2>Senha Atualizada!</h2>
          <p>Sua senha foi redefinida com sucesso. Redirecionando você para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <div className="reset-card glass-card">
        <header className="reset-header">
          <h1>Nova Senha<span className="dot">.</span></h1>
          <p>Defina sua nova credencial de acesso com segurança.</p>
        </header>

        <form onSubmit={handleReset} className="reset-form">
          <div className="field-modern">
            <Lock size={18} className="field-icon-left" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="field-icon-right" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="field-modern">
            <Lock size={18} className="field-icon-left" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar Nova Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-box"><AlertCircle size={14} /> {error}</div>}

          <button type="submit" className="btn-vies-primary" disabled={loading}>
            {loading ? <Loader2 className="spin" size={20} /> : (
              <>
                <span>Redefinir Senha</span>
                <CheckCircle2 size={18} />
              </>
            )}
          </button>

          <button type="button" className="btn-back" onClick={() => navigate('/login')}>
            <ArrowLeft size={16} /> Voltar para o Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
