"use client";

import ProtectedPage from '@/components/ProtectedPage';
import AdvocateDashboard from '@/screens/AdvocateDashboard';
import { useAuth } from '@/context/AuthContext';

export default function AdvocateDashboardPage() {
  const { logout } = useAuth();
  return (
    <ProtectedPage roles={['advocate']}>
      {({ user }) => <AdvocateDashboard user={user} logout={logout} />}
    </ProtectedPage>
  );
}
