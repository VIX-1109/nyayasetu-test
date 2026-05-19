"use client";

import Landing from '@/screens/Landing';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();
  return <Landing user={user} logout={logout} />;
}
