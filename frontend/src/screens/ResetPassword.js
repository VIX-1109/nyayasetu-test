"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/services/authService';
import { getPasswordValidationMessage } from '@/lib/passwordPolicy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordIssue = getPasswordValidationMessage(password);
    if (passwordIssue) {
      toast.error(passwordIssue);
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      toast.success('Password updated. Please login with your new password.');
      router.replace('/auth');
    } catch (error) {
      toast.error(error.message || 'Unable to update password. Please open a fresh reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6">
      <div className="w-full max-w-md rounded-sm bg-white p-8 shadow-[0_2px_8px_rgba(15,23,42,0.08)] md:p-12">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
          <span className="serif text-2xl font-bold text-[#0F172A]">NyayaSetu</span>
        </Link>
        <h1 className="serif mb-2 text-center text-3xl font-semibold text-[#0F172A]">Set New Password</h1>
        <p className="mb-8 text-center text-sm text-slate-600">Choose a strong password to secure your account.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="h-12 rounded-sm border-slate-200 bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required className="h-12 rounded-sm border-slate-200 bg-white" />
          </div>
          <p className="text-xs text-slate-500">
            Use 8+ characters with uppercase, lowercase, number, and special character.
          </p>
          <Button type="submit" disabled={loading} className="h-12 w-full rounded-sm bg-[#0F172A] font-medium text-white hover:bg-[#0F172A]/90">
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
