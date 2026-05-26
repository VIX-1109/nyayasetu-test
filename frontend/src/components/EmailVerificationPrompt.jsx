"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { resendVerificationEmail } from '@/services/authService';
import { MailCheck, X } from 'lucide-react';
import { toast } from 'sonner';

const EmailVerificationPrompt = ({ email, onClose, floating = false }) => {
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('Enter your email first so we can send the verification link.');
      return;
    }

    setSending(true);
    try {
      await resendVerificationEmail(email);
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error) {
      toast.error(error.message || 'Unable to send verification email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={floating ? 'fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm' : ''}>
      <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-lg">
        <div className="flex items-start gap-3">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Verify your email</p>
            <p className="mt-1 text-sm text-amber-900">
              Dashboard access stays locked until your email is verified.
            </p>
            {email && <p className="mt-1 truncate text-xs font-medium text-amber-800">{email}</p>}
            <Button
              type="button"
              onClick={handleResend}
              disabled={sending}
              className="mt-3 h-9 rounded-sm bg-[#0F172A] px-4 text-xs font-bold text-white hover:bg-[#0F172A]/90"
            >
              {sending ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="rounded-sm p-1 text-amber-700 hover:bg-amber-100" aria-label="Close verification prompt">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPrompt;
