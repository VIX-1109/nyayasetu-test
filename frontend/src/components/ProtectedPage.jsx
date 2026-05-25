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

const ProtectedPage = ({ roles, requireEmailConfirmed = true, requireVerifiedAdvocate = false, children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth');
      return;
    }
    if (requireEmailConfirmed && !user.email_confirmed_at) {
      router.replace('/auth?verify_email=1');
      return;
    }
    if (roles?.length && user?.role && !roles.includes(user.role)) {
      router.replace(dashboardFor(user.role));
      return;
    }
    if (requireVerifiedAdvocate && user.role === 'advocate' && user.advocate_verification_status !== 'verified') {
      router.replace('/advocate');
    }
  }, [loading, user, roles, requireEmailConfirmed, requireVerifiedAdvocate, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (
    !user ||
    (requireEmailConfirmed && !user.email_confirmed_at) ||
    (roles?.length && !roles.includes(user.role)) ||
    (requireVerifiedAdvocate && user.role === 'advocate' && user.advocate_verification_status !== 'verified')
  ) {
    return null;
  }

  return children({ user });
};

export default ProtectedPage;
