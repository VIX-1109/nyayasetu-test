"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Auth from '@/screens/Auth';
import { useAuth } from '@/context/AuthContext';
import { getDashboardPath } from '@/components/ProtectedPage';
import EmailVerificationPrompt from '@/components/EmailVerificationPrompt';

export default function AuthPage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email_confirmed_at) {
      router.replace(getDashboardPath(user.role));
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (user && !user.email_confirmed_at) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6">
        <div className="w-full max-w-md">
          <EmailVerificationPrompt email={user.email} />
        </div>
      </div>
    );
  }

  return <Auth setUser={setUser} />;
}
