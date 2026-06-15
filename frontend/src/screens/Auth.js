"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import { signIn, signUp, fetchProfile, requestPasswordReset } from '@/services/authService';
import { getPasswordValidationMessage } from '@/lib/passwordPolicy';
import EmailVerificationPrompt from '@/components/EmailVerificationPrompt';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Scale, CheckCircle2, Shield, BookOpen, Users, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex">

      {/* LEFT PANEL — branding */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)' }}
      >
        {/* Decorative scale watermark */}
        <Scale className="absolute -right-16 -bottom-16 h-96 w-96 text-white/5" strokeWidth={0.8} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <AnimatedLogo size={28} navy="#ffffff" />
        </Link>

        {/* Main copy */}
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-white/90 text-sm font-medium">India's Verified Legal Platform</span>
            </div>
            <h1 className="text-4xl font-bold serif text-white leading-tight">
              Justice is now<br />
              <span className="text-[#B45309]">one step away.</span>
            </h1>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Connect with verified advocates, understand your legal rights, and get expert guidance — free for every Indian citizen.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Every advocate is admin-verified with Bar Council validation' },
              { icon: BookOpen, text: 'AI-powered legal learning in Hindi and English' },
              { icon: Users, text: 'Community feed with real legal awareness posts' },
            ].map((feat) => (
              <div key={feat.text} className="flex items-start gap-3">
                <div className="bg-[#B45309]/20 p-2 rounded-sm shrink-0">
                  <feat.icon className="h-4 w-4 text-[#B45309]" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{feat.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-slate-600 text-xs">© 2026 NyayaSetu · Built for India</p>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="w-full lg:w-[48%] flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md space-y-8" data-testid="auth-form">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 lg:hidden">
            <AnimatedLogo size={28} />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold serif text-[#0F172A]">
              {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isForgot
                ? 'Enter your email to receive a secure reset link'
                : isLogin
                ? 'Login to access your legal dashboard'
                : 'Register to connect with verified advocates'}
            </p>
          </div>

          {verificationNotice && <EmailVerificationPrompt email={email} />}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
                <Input
                  id="name"
                  data-testid="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="h-12 bg-slate-50 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-sm transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
              <Input
                id="email"
                data-testid="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="h-12 bg-slate-50 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-sm transition-colors"
              />
            </div>

            {!isForgot && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
                  {isLogin && (
                    <button type="button" onClick={() => setMode('forgot')} className="text-xs font-semibold text-[#B45309] hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  data-testid="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-12 bg-slate-50 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-sm transition-colors"
                />
                {isRegister && (
                  <p className="text-xs text-slate-400">8+ characters with uppercase, lowercase, number, and special character.</p>
                )}
              </div>
            )}

            {isRegister && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">I am a</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value === 'advocate' ? 'advocate' : 'client')} data-testid="role-radio-group">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'client', label: 'Citizen', desc: 'Seeking legal help' },
                      { value: 'advocate', label: 'Advocate', desc: 'Legal professional' },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        htmlFor={opt.value}
                        className={`flex flex-col gap-1 p-3 border-2 rounded-sm cursor-pointer transition-all ${
                          role === opt.value
                            ? 'border-[#0F172A] bg-[#0F172A]/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value={opt.value} id={opt.value} data-testid={`role-${opt.value}`} />
                          <span className="font-bold text-sm text-[#0F172A]">{opt.label}</span>
                        </div>
                        <span className="text-xs text-slate-500 pl-5">{opt.desc}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              data-testid="submit-btn"
              className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : isForgot ? 'Send Reset Link' : isLogin ? 'Login to NyayaSetu' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
            {isForgot ? (
              <button type="button" onClick={() => setMode('login')} className="text-[#B45309] font-semibold hover:underline">
                ← Back to login
              </button>
            ) : (
              <p>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setMode(isLogin ? 'register' : 'login')}
                  className="text-[#B45309] font-semibold hover:underline"
                  data-testid="toggle-auth-btn"
                >
                  {isLogin ? 'Register here' : 'Login'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Auth;
