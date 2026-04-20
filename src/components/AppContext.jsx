import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Context creation
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('lumen_theme') || 'dark');
  
  // User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('--- AppContext Debug ---');
  console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'DEFINIDO' : 'AUSENTE');
  console.log('SUPABASE_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDO' : 'AUSENTE');

  // Update DOM Theme & Persistence
  useEffect(() => {
    localStorage.setItem('lumen_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth Listener
  useEffect(() => {
    // Timeout de segurança: se o banco demorar mais de 6s, libera a tela
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 6000);

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          await fetchUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro na sessão inicial:', err);
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Evento de Auth:', event);
      if (session) {
        await fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
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

      setUser({
        id: authUser.id,
        email: authUser.email,
        name: data?.full_name || authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        avatarBase64: data?.avatar_url || authUser.user_metadata?.avatar_url || null,
        email_confirmed_at: authUser.email_confirmed_at
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) await fetchUserProfile(authUser);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      refreshUser,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
