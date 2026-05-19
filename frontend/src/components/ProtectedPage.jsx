"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const dashboardFor = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'advocate') return '/advocate/dashboard';
  return '/client/dashboard';
};

export const getDashboardPath = dashboardFor;

const ProtectedPage = ({ roles, children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth');
      return;
    }
    if (roles?.length && !roles.includes(user.role)) {
      router.replace(dashboardFor(user.role));
    }
  }, [loading, user, roles, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!user || (roles?.length && !roles.includes(user.role))) {
    return null;
  }

  return children({ user });
};

export default ProtectedPage;
