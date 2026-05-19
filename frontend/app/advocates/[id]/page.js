"use client";

import { use } from 'react';
import AdvocateProfile from '@/screens/AdvocateProfile';
import { useAuth } from '@/context/AuthContext';

export default function AdvocateProfilePage({ params }) {
  const { id } = use(params);
  const { user, logout } = useAuth();
  return <AdvocateProfile user={user} logout={logout} advocateId={id} />;
}
