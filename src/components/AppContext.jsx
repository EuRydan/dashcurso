import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const CACHE_KEY = 'sb-profile-cache';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!localStorage.getItem(CACHE_KEY));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout: garante que o loading pare mesmo se tudo falhar
    const safetyTimeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session && isMounted) {
          const authUser = session.user;
          // Atualiza com dados básicos imediatamente para desbloquear a UI
          setUser(prev => ({
            ...prev,
            id: authUser.id,
            email: authUser.email,
            nickname: authUser.user_metadata?.nickname ||
                      authUser.user_metadata?.full_name?.split(' ')[0] ||
                      authUser.email.split('@')[0],
            full_name: authUser.user_metadata?.full_name || '',
            avatarBase64: authUser.user_metadata?.avatar_url || null,
            email_confirmed_at: authUser.email_confirmed_at
          }));
          setLoading(false);
          // Enriquece com dados do banco em background
          fetchUserProfile(authUser);
        } else if (isMounted) {
          setUser(null);
          setLoading(false);
          localStorage.removeItem(CACHE_KEY);
        }
      } catch (err) {
        console.error('Erro na inicialização de Auth:', err);
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // FIX: onAuthStateChange com timeout de segurança para não travar na inicialização
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && isMounted) {
        const authUser = session.user;
        setUser(prev => ({
          ...prev,
          id: authUser.id,
          email: authUser.email,
          nickname: authUser.user_metadata?.nickname ||
                    authUser.user_metadata?.full_name?.split(' ')[0] ||
                    prev?.nickname ||
                    authUser.email.split('@')[0],
          full_name: authUser.user_metadata?.full_name || prev?.full_name || '',
          email_confirmed_at: authUser.email_confirmed_at
        }));

        // Enriquece com timeout de proteção
        try {
          await Promise.race([
            fetchUserProfile(authUser),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('fetchUserProfile timeout')), 5000)
            )
          ]);
        } catch (err) {
          console.warn('fetchUserProfile timeout no auth change:', err.message);
          if (isMounted) setLoading(false);
        }
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setUser(null);
        setLoading(false);
        localStorage.removeItem(CACHE_KEY);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const profileData = {
        id: authUser.id,
        email: authUser.email,
        nickname: data?.nickname || authUser.user_metadata?.nickname || authUser.email.split('@')[0],
        full_name: data?.full_name || authUser.user_metadata?.full_name || '',
        avatarBase64: data?.avatar_url || authUser.user_metadata?.avatar_url || null,
        status: data?.status || 'Estudante',
        country: data?.country || 'Brasil',
        phone: data?.phone || '',
        email_confirmed_at: authUser.email_confirmed_at
      };

      setUser(profileData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(profileData));
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) await fetchUserProfile(authUser);
  };

  // FIX: localStorage.clear() removido — só limpa dados do app
  const logout = async () => {
    console.log('[Logout] Iniciando...');
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]);
    } catch (err) {
      console.warn('[Logout] signOut ignorado:', err.message);
    } finally {
      localStorage.removeItem(CACHE_KEY); // FIX: só remove o cache do app, não tudo
      setUser(null);
      console.log('[Logout] Redirecionando...');
      window.location.href = '/login';
    }
  };

  return (
    <AppContext.Provider value={{
      theme: 'dark',
      toggleTheme: () => {},
      user,
      refreshUser,
      logout,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
