"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, fetchProfile, onAuthStateChange, signOut } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    getSession().then((session) => {
      if (!mounted) return;
      if (session) {
        fetchProfile(session.user).then((profile) => {
          if (!mounted) return;
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const subscription = onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user).then((profile) => {
          setUser(profile);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    router.push('/');
  };

  const value = useMemo(() => ({ user, setUser, loading, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
