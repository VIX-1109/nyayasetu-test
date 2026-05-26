"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import EmailVerificationPrompt from '@/components/EmailVerificationPrompt';
import { MailCheck, X } from 'lucide-react';

const EmailVerificationOverlay = () => {
  const { user, loading } = useAuth();
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (loading || !visible || !user || user.email_confirmed_at) return null;

  if (expanded) {
    return <EmailVerificationPrompt email={user.email} floating onClose={() => setExpanded(false)} />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-amber-200 bg-amber-50 p-1.5 pl-3 text-amber-950 shadow-lg">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 text-sm font-semibold"
      >
        <MailCheck className="h-4 w-4 text-amber-700" />
        Verify email
      </button>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="grid h-7 w-7 place-items-center rounded-full text-amber-700 hover:bg-amber-100"
        aria-label="Hide email verification prompt"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EmailVerificationOverlay;
