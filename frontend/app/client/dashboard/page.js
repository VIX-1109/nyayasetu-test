"use client";

import ProtectedPage from '@/components/ProtectedPage';
import ClientDashboard from '@/screens/ClientDashboard';
import { useAuth } from '@/context/AuthContext';

export default function ClientDashboardPage() {
  const { logout } = useAuth();
  return (
    <ProtectedPage roles={['client']}>
      {({ user }) => <ClientDashboard user={user} logout={logout} />}
    </ProtectedPage>
  );
}
