"use client";

import { use } from 'react';
import ProtectedPage from '@/components/ProtectedPage';
import Messages from '@/screens/Messages';
import { useAuth } from '@/context/AuthContext';

export default function MessagesPage({ params }) {
  const { userId } = use(params);
  const { logout } = useAuth();
  return (
    <ProtectedPage>
      {({ user }) => <Messages user={user} logout={logout} peerUserId={userId} />}
    </ProtectedPage>
  );
}
