"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchProfile, onAuthStateChange, signOut } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((authUser) => {
      if (!mounted) return;
      if (authUser) {
        fetchProfile(authUser).then((profile) => {
          if (!mounted) return;
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const subscription = onAuthStateChange((_event, session) => {
      if (session?.user) {
        getCurrentUser().then((authUser) => {
          if (!authUser) {
            setUser(null);
            setLoading(false);
            return;
          }
          return fetchProfile(authUser);
        }).then((profile) => {
          if (!profile) return;
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

  const refreshUser = async () => {
    const authUser = await getCurrentUser();
    const profile = authUser ? await fetchProfile(authUser) : null;
    setUser(profile);
    return profile;
  };

  const value = useMemo(() => ({ user, setUser, loading, logout, refreshUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
