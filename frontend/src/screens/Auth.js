"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, signUp, fetchProfile, requestPasswordReset } from '@/services/authService';
import { getPasswordValidationMessage } from '@/lib/passwordPolicy';
import EmailVerificationPrompt from '@/components/EmailVerificationPrompt';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Scale } from 'lucide-react';

const Auth = ({ setUser }) => {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState(searchParams.get('verify_email') === '1');

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerificationNotice(false);

    try {
      if (isForgot) {
        await requestPasswordReset(email);
        toast.success('Password reset email sent. Please check your inbox.');
        setVerificationNotice(true);
        return;
      }

      if (isRegister) {
        const passwordIssue = getPasswordValidationMessage(password);
        if (passwordIssue) throw new Error(passwordIssue);

        await signUp(email, password, name, role);
        setVerificationNotice(true);
        toast.success('Account created. Please verify your email before logging in.');
        setMode('login');
        setPassword('');
        return;
      }

      const authUser = await signIn(email, password);
      const userObj = authUser ? await fetchProfile(authUser) : authUser;
      setUser(userObj);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6">
      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(15,23,42,0.08)] p-8 md:p-12 w-full max-w-md" data-testid="auth-form">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
          <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
        </div>

        <h2 className="text-3xl font-semibold serif text-[#0F172A] text-center mb-2">
          {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-slate-600 text-center mb-8">
          {isForgot ? 'Enter your email to receive a secure reset link' : isLogin ? 'Login to access your account' : 'Register to get started'}
        </p>

        {verificationNotice && <EmailVerificationPrompt email={email} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" data-testid="name-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/20 rounded-sm" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" data-testid="email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/20 rounded-sm" />
          </div>
          {!isForgot && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <button type="button" onClick={() => setMode('forgot')} className="text-xs font-semibold text-[#B45309] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input id="password" data-testid="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/20 rounded-sm" />
              {isRegister && (
                <p className="text-xs text-slate-500">
                  Use 8+ characters with uppercase, lowercase, number, and special character.
                </p>
              )}
            </div>
          )}
          {isRegister && (
            <div className="space-y-3">
              <Label>Register as</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value === 'advocate' ? 'advocate' : 'client')} data-testid="role-radio-group">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client" data-testid="role-client" />
                  <Label htmlFor="client" className="font-normal cursor-pointer">Client (seeking legal help)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advocate" id="advocate" data-testid="role-advocate" />
                  <Label htmlFor="advocate" className="font-normal cursor-pointer">Advocate (legal professional)</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          <Button type="submit" disabled={loading} data-testid="submit-btn" className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-medium shadow-md transition-all hover:-translate-y-0.5">
            {loading ? 'Processing...' : isForgot ? 'Send Reset Link' : isLogin ? 'Login' : 'Register'}
          </Button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm text-slate-600">
          {isForgot ? (
            <button type="button" onClick={() => setMode('login')} className="text-[#B45309] font-medium hover:underline">
              Back to login
            </button>
          ) : (
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setMode(isLogin ? 'register' : 'login')} className="text-[#B45309] font-medium hover:underline" data-testid="toggle-auth-btn">
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
