"use client";

import ProtectedPage from '@/components/ProtectedPage';
import MessagesInbox from '@/screens/MessagesInbox';
import { useAuth } from '@/context/AuthContext';

export default function MessagesInboxPage() {
  const { logout } = useAuth();
  return (
    <ProtectedPage>
      {({ user }) => <MessagesInbox user={user} logout={logout} />}
    </ProtectedPage>
  );
}
