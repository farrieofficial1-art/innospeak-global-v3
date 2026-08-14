import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { getProfile } from '../supabase/auth';

/**
 * AuthContext — the single source of truth for the current session
 * across the app. Mounted once in main.jsx (wrapping <App />), read
 * anywhere via useAuth().
 *
 * `user` is the raw Supabase auth user (id/email). `profile` is the
 * matching row from `profiles` (role, full_name) — created
 * automatically by the handle_new_user() DB trigger on sign-up.
 */
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    getProfile(user.id).then((p) => {
      if (!cancelled) setProfile(p);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    role: profile?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}