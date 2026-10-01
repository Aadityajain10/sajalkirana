import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent demo admin login
    const savedUser = localStorage.getItem('sajal_kirana_admin');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved admin user', e);
      }
    }

    // Check Supabase session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // 1. Try Supabase Auth first if configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      return data.user;
    }

    // 2. Demo Admin Login Fallback
    if (email === 'admin@sajalkirana.com' && password === 'admin123') {
      const demoAdmin = {
        id: 'admin-super-01',
        email: 'admin@sajalkirana.com',
        user_metadata: { role: 'admin', full_name: 'Sajal (Store Owner)' },
        role: 'authenticated'
      };
      setUser(demoAdmin);
      localStorage.setItem('sajal_kirana_admin', JSON.stringify(demoAdmin));
      return demoAdmin;
    }

    throw new Error('Invalid email or password. Use demo: admin@sajalkirana.com / admin123');
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('sajal_kirana_admin');
  };

  const isAdmin = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
