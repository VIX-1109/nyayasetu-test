"use client";

import ProtectedPage from '@/components/ProtectedPage';
import Profile from '@/screens/Profile';

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <Profile />
    </ProtectedPage>
  );
}
