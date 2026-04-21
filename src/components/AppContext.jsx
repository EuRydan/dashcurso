import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Context creation
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const CACHE_KEY = 'sb-profile-cache';

export const AppProvider = ({ children }) => {
  // Theme State (Always dark as per user preference)
  const [theme] = useState('dark');
  
  // User State - Try to hydrate from localStorage first
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  
  // If we have cached user, we can set loading to false immediately
  const [loading, setLoading] = useState(!localStorage.getItem(CACHE_KEY));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Auth Listener & Initialization
  useEffect(() => {
    let isMounted = true;

    // Reduzido para 3s para uma experiência mais ágil em caso de erro
    const safetyTimeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session && isMounted) {
          const authUser = session.user;
          const basicUser = {
            id: authUser.id,
            email: authUser.email,
            nickname: authUser.user_metadata?.nickname || authUser.user_metadata?.full_name?.split(' ')[0] || authUser.email.split('@')[0],
            full_name: authUser.user_metadata?.full_name || '',
            avatarBase64: authUser.user_metadata?.avatar_url || null,
            email_confirmed_at: authUser.email_confirmed_at
          };

          // Update state with basic info immediately to unlock UI
          setUser(prev => ({ ...prev, ...basicUser }));
          setLoading(false); // UI becomes interactive here!
          
          // Enrich in background
          await fetchUserProfile(authUser);
        } else if (isMounted) {
          setLoading(false);
          setUser(null);
          localStorage.removeItem(CACHE_KEY);
        }
      } catch (err) {
        console.error('Erro na inicialização de Auth:', err);
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && isMounted) {
        const authUser = session.user;
        setUser(prev => ({
          ...prev,
          id: authUser.id,
          email: authUser.email,
          nickname: authUser.user_metadata?.nickname || authUser.user_metadata?.full_name?.split(' ')[0] || prev?.nickname || authUser.email.split('@')[0],
          full_name: authUser.user_metadata?.full_name || prev?.full_name || '',
          email_confirmed_at: authUser.email_confirmed_at
        }));
        await fetchUserProfile(authUser);
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
      
      // PERSISTÊNCIA: Salva no localStorage para a próxima carga instantânea
      localStorage.setItem(CACHE_KEY, JSON.stringify(profileData));
      
    } catch (err) {
      console.error('Error fetching profile enrichment:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) await fetchUserProfile(authUser);
  };

  const logout = async () => {
    console.log('[Logout] Processo de saída iniciado...');
    try {
      // Tenta deslogar do Supabase, mas não espera mais que 2 segundos
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]);
    } catch (err) {
      console.warn('[Logout] Alerta: Signout do servidor ignorado ou falhou:', err.message);
    } finally {
      // Limpeza BRUTA de qualquer rastro local
      localStorage.removeItem(CACHE_KEY);
      localStorage.clear(); 
      setUser(null);
      
      console.log('[Logout] Redirecionando para login...');
      // Força o redirecionamento total da janela
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
