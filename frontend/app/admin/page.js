"use client";

import ProtectedPage from '@/components/ProtectedPage';
import AdminDashboard from '@/screens/AdminDashboard';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { logout } = useAuth();
  return (
    <ProtectedPage roles={['admin']}>
      {({ user }) => <AdminDashboard user={user} logout={logout} />}
    </ProtectedPage>
  );
}
