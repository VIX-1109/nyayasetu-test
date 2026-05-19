"use client";

import AdvocateDirectory from '@/screens/AdvocateDirectory';
import { useAuth } from '@/context/AuthContext';

export default function AdvocatesPage() {
  const { user, logout } = useAuth();
  return <AdvocateDirectory user={user} logout={logout} />;
}
