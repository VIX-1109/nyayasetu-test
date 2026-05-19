"use client";

import JusticeFeed from '@/screens/JusticeFeed';
import { useAuth } from '@/context/AuthContext';

export default function FeedPage() {
  const { user, logout } = useAuth();
  return <JusticeFeed user={user} logout={logout} />;
}
