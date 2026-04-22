import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from './AppContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute
 * 1. Exibe loading enquanto o Supabase inicializa a sessão.
 * 2. Se não houver usuário, redireciona para /login.
 * 3. Se houver usuário, renderiza as rotas internas (Outlet).
 */
const ProtectedRoute = () => {
  const { user, loading } = useAppContext();

  // 1. Enquanto estiver carregando a sessão do Supabase
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <Loader2 className="spin" size={48} color="var(--color-primary)" />
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // 2. Se o loading acabou e não temos usuário, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Usuário autenticado, renderiza o conteúdo interno
  return <Outlet />;
};

export default ProtectedRoute;
