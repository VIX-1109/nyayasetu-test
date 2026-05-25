"use client";

import ProtectedPage from '@/components/ProtectedPage';
import AdvocateVerification from '@/screens/AdvocateVerification';
import { useAuth } from '@/context/AuthContext';

export default function AdvocateVerificationPage() {
  const { logout } = useAuth();
  return (
    <ProtectedPage roles={['advocate']}>
      {({ user }) => <AdvocateVerification user={user} logout={logout} />}
    </ProtectedPage>
  );
}
