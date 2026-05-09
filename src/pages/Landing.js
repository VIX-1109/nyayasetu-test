import { Link } from 'react-router-dom';
import { Scale, BookOpen, Users, Shield, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = ({ user, logout }) => {
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-slate-200 px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Find Advocates
            </Link>
            <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">
              AI Law Learning
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'}>
                  <Button data-testid="dashboard-btn" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 px-8 rounded-sm font-medium shadow-md transition-all hover:-translate-y-0.5">
                    Dashboard
                  </Button>
                </Link>
                <Button data-testid="logout-btn" onClick={logout} variant="ghost" className="text-slate-700">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button data-testid="login-btn" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 px-8 rounded-sm font-medium shadow-md transition-all hover:-translate-y-0.5">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none serif" data-testid="hero-title">
              Bridge to Justice
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-slate-300">
              Connect with verified advocates across India. Get expert legal consultation and learn about your rights through AI-powered law education.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/advocates">
                <Button data-testid="find-advocate-btn" className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-8 rounded-sm font-medium shadow-md transition-all hover:-translate-y-0.5">
                  Find an Advocate <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/ai-learning">
                <Button data-testid="learn-law-btn" variant="outline" className="bg-white border-2 border-white text-[#0F172A] hover:bg-slate-50 h-12 px-8 rounded-sm font-medium transition-all">
                  Learn Law with AI
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1595628423365-cd4e640edecc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBsYXd5ZXIlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzA4MjI4MjR8MA&ixlib=rb-4.1.0&q=85"
              alt="Professional Advocate"
              className="rounded-sm shadow-[0_2px_8px_rgba(15,23,42,0.08)] w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight serif text-[#0F172A] text-center mb-16">
            Why Choose NyayaSetu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-slate-50 p-8 border-l-4 border-[#B45309] hover:bg-white transition-colors" data-testid="feature-verified">
              <Shield className="h-12 w-12 text-[#B45309] mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl md:text-3xl font-medium serif text-[#0F172A] mb-3">
                Verified Advocates
              </h3>
              <p className="text-base leading-relaxed text-slate-700">
                Two-step verification process with admin approval and Bar Council registration validation.
              </p>
            </div>
            <div className="bg-slate-50 p-8 border-l-4 border-[#B45309] hover:bg-white transition-colors" data-testid="feature-ai">
              <BookOpen className="h-12 w-12 text-[#B45309] mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl md:text-3xl font-medium serif text-[#0F172A] mb-3">
                AI-Powered Learning
              </h3>
              <p className="text-base leading-relaxed text-slate-700">
                Learn about Indian laws, rights, and legal procedures through intelligent AI conversations.
              </p>
            </div>
            <div className="bg-slate-50 p-8 border-l-4 border-[#B45309] hover:bg-white transition-colors" data-testid="feature-connect">
              <Users className="h-12 w-12 text-[#B45309] mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl md:text-3xl font-medium serif text-[#0F172A] mb-3">
                Direct Connection
              </h3>
              <p className="text-base leading-relaxed text-slate-700">
                Book appointments, chat with advocates, and get expert legal consultation seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight serif text-[#0F172A] mb-6">
            Justice Made Accessible
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-slate-700 mb-8">
            Whether you need legal consultation or want to understand your rights, NyayaSetu is your trusted platform.
          </p>
          <Link to="/auth">
            <Button data-testid="get-started-btn" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 px-8 rounded-sm font-medium shadow-md transition-all hover:-translate-y-0.5">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>

      <footer className="bg-[#0F172A] text-white px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="h-6 w-6" strokeWidth={1.5} />
            <span className="text-xl font-bold serif">NyayaSetu</span>
          </div>
          <p className="text-slate-400">© 2026 NyayaSetu. Bridging the gap to justice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


