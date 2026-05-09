import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Scale } from 'lucide-react';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let authUser;
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        authUser = data.user;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role } }
        });
        if (error) throw error;
        authUser = data.user;
      }
      
      // Fetch profile to redirect correctly
      let userObj = authUser;
      if (authUser) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
        if (profile) userObj = { ...authUser, ...profile };
      }
      
      setUser(userObj);
      toast.success(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      
      if (userObj.role === 'admin') {
        navigate('/admin');
      } else if (userObj.role === 'advocate') {
        navigate('/advocate/dashboard');
      } else {
        navigate('/client/dashboard');
      }
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
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-slate-600 text-center mb-8">
          {isLogin ? 'Login to access your account' : 'Register to get started'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                data-testid="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/20 rounded-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              data-testid="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/20 rounded-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              data-testid="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/20 rounded-sm"
            />
          </div>

          {!isLogin && (
            <div className="space-y-3">
              <Label>Register as</Label>
              <RadioGroup value={role} onValueChange={setRole} data-testid="role-radio-group">
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

          <Button
            type="submit"
            disabled={loading}
            data-testid="submit-btn"
            className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-medium shadow-md transition-all hover:-translate-y-0.5"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#B45309] font-medium hover:underline"
            data-testid="toggle-auth-btn"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;


