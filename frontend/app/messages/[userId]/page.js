"use client";

import { useParams } from 'next/navigation';
import ProtectedPage from '@/components/ProtectedPage';
import Messages from '@/screens/Messages';
import { useAuth } from '@/context/AuthContext';

export default function MessagesPage() {
  const { userId } = useParams();
  const { logout } = useAuth();
  return (
    <ProtectedPage>
      {({ user }) => <Messages user={user} logout={logout} peerUserId={userId} />}
    </ProtectedPage>
  );
}
