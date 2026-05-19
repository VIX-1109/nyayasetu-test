"use client";

import AILawLearning from '@/screens/AILawLearning';
import { useAuth } from '@/context/AuthContext';

export default function AiLearningPage() {
  const { user, logout } = useAuth();
  return <AILawLearning user={user} logout={logout} />;
}
