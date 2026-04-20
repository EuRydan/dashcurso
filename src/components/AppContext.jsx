import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Context creation
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme] = useState('dark');
  
  // User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('--- AppContext Debug ---');
  console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'DEFINIDO' : 'AUSENTE');
  console.log('SUPABASE_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDO' : 'AUSENTE');

  // Update DOM Theme & Persistence
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Auth Listener & Initialization
  useEffect(() => {
    let isMounted = true;

    // Timeout de segurança: se o banco demorar mais de 6s, libera a tela
    const safetyTimeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 6000);

    const initializeAuth = async () => {
      try {
        // 1. Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session && isMounted) {
          // IMPORTANT: Set basic user info immediately so AuthGuard doesn't redirect
          const authUser = session.user;
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
            avatarBase64: authUser.user_metadata?.avatar_url || null,
            email_confirmed_at: authUser.email_confirmed_at
          });
          
          // 2. Fetch profile in background to enrich
          await fetchUserProfile(authUser);
        } else if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro na inicialização de Auth:', err);
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // 3. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Evento de Auth:', event);
      if (session && isMounted) {
        const authUser = session.user;
        // Update user state immediately on sign in/refresh
        setUser(prev => ({
          ...prev,
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || prev?.name || authUser.email.split('@')[0],
          email_confirmed_at: authUser.email_confirmed_at
        }));
        await fetchUserProfile(authUser);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setUser(null);
        setLoading(false);
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

      setUser({
        id: authUser.id,
        email: authUser.email,
        name: data?.full_name || authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        avatarBase64: data?.avatar_url || authUser.user_metadata?.avatar_url || null,
        email_confirmed_at: authUser.email_confirmed_at
      });
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppContext.Provider value={{
      theme: 'dark',
      toggleTheme: () => {}, // Disable toggle
      user,
      refreshUser,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
