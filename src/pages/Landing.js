import { Link } from 'react-router-dom';
import { Scale, BookOpen, Users, Shield, ArrowRight, Newspaper, BadgeCheck, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = ({ user, logout }) => {
  return (
    <div className="min-h-screen">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </div>
          <div className="ns-nav-links">
            <Link to="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Find Advocates
            </Link>
            <Link to="/feed" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Justice Feed
            </Link>
            <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">
              AI Law Learning
            </Link>
            {user ? (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ns-band py-14 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-6">
            <h1 className="ns-hero-title" data-testid="hero-title">
              Bridge to Justice
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-slate-300">
              Connect with verified advocates across India. Get expert legal consultation and learn about your rights through AI-powered law education.
            </p>
            <div className="ns-actions pt-4">
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
              <Link to="/feed">
                <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0F172A] h-12 px-8 rounded-sm font-medium transition-all">
                  Open Justice Feed
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

      <div className="ns-band py-14 md:py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="ns-heading-xl text-center mb-10 md:mb-16">
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

      <div className="bg-slate-50 ns-band py-14 md:py-28">
        <div className="max-w-7xl mx-auto mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#B45309] font-medium mb-2">
                <Newspaper className="h-5 w-5" />
                Professional Justice Network
              </div>
              <h2 className="ns-heading-xl">
                Learn, discuss, and seek help around Nyaya
              </h2>
            </div>
            <Link to="/feed" className="hidden md:block">
              <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 px-8 rounded-sm font-medium">
                View Feed
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck className="h-5 w-5 text-emerald-700" />
                <span className="text-xs uppercase tracking-wider text-slate-500">Verified Advocate</span>
              </div>
              <h3 className="text-xl font-semibold serif text-[#0F172A] mb-3">Tenant Rights: Deposit Recovery</h3>
              <p className="text-slate-700 leading-relaxed">
                Collect agreement copies, rent receipts, chats, and handover proof before sending a formal notice or consulting an advocate.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-[#B45309]" />
                <span className="text-xs uppercase tracking-wider text-slate-500">Legal Awareness</span>
              </div>
              <h3 className="text-xl font-semibold serif text-[#0F172A] mb-3">Consumer Complaint Checklist</h3>
              <p className="text-slate-700 leading-relaxed">
                Keep invoices, screenshots, delivery details, and complaint ticket IDs to make a stronger consumer grievance.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-5 w-5 text-[#0F766E]" />
                <span className="text-xs uppercase tracking-wider text-slate-500">Safe Help Request</span>
              </div>
              <h3 className="text-xl font-semibold serif text-[#0F172A] mb-3">Need Property Guidance</h3>
              <p className="text-slate-700 leading-relaxed">
                Ask general questions publicly, but keep personal names, case numbers, and documents private for consultation.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <h2 className="ns-heading-xl mb-6">
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

      <footer className="bg-[#0F172A] text-white ns-band py-12">
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


