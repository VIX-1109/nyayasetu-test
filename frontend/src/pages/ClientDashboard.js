import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Scale, Calendar, BookOpen, Newspaper, Star, MessageSquare, FileText, ChevronRight, Clock, CheckCircle2, User } from 'lucide-react';
import { Inbox } from '@/components/Inbox';
import { useClientDashboard } from '@/hooks/useClientDashboard';

const CitizenDashboard = ({ user, logout }) => {
  const { appointments, loading, savedAdvocates, getStatusColor } = useClientDashboard(user);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link to="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">Find Advocates</Link>
            <Link to="/feed" className="text-slate-700 hover:text-[#0F172A] font-medium">Justice Feed</Link>
            <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">AI Learning</Link>
            <Button onClick={logout} variant="ghost" className="text-slate-700">Logout</Button>
          </div>
        </div>
      </nav>

      <main className="ns-page">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <section className="bg-[#0F172A] text-white rounded-sm p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold serif mb-4">Welcome back, {user.name}</h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Your secure legal command center. Manage consultations, track your legal learning journey, and securely access your case materials.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/ai-learning">
                  <Button className="bg-[#B45309] hover:bg-[#B45309]/90 text-white px-6 h-12 rounded-sm font-medium">
                    Ask AI Assistant
                  </Button>
                </Link>
                <Link to="/advocates">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#0F172A] px-6 h-12 rounded-sm font-medium">
                    New Consultation
                  </Button>
                </Link>
              </div>
            </div>
            <Scale className="absolute -right-20 -bottom-20 h-80 w-80 text-white/5" />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-8">
              
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A]">Active Consultations</h2>
                  <Link to="/advocates" className="text-sm font-medium text-[#B45309] hover:underline">Book New</Link>
                </div>
                
                {loading ? (
                  <div className="text-center py-12 bg-white border border-slate-200 rounded-sm">Loading requests...</div>
                ) : appointments.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-300 rounded-sm p-12 text-center space-y-4">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto" />
                    <p className="text-slate-600">You have no active consultation requests.</p>
                    <Link to="/advocates">
                      <Button variant="outline" className="rounded-sm border-[#B45309] text-[#B45309]">Find an Advocate</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((app) => (
                      <div key={app.id} className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${app.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-sm ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {app.date}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#0F172A] mb-1">{app.advocates?.profiles?.name || 'Advocate'}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">{app.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs font-mono text-slate-400">{app.time}</span>
                          <Button variant="ghost" size="sm" className="h-8 text-[#B45309] hover:text-[#B45309]/80 group-hover:translate-x-1 transition-transform">
                            Details <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A]">Recent Messages</h2>
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                </div>
                <div className="p-0">
                  <Inbox emptyHint="Your legal conversations will appear here after you message an advocate." />
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              
              <div className="grid grid-cols-2 gap-4">
                <Link to="/ai-learning" className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm hover:border-[#B45309] transition-colors group text-center">
                  <BookOpen className="h-6 w-6 text-[#B45309] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-[#0F172A]">AI Help</span>
                </Link>
                <Link to="/feed" className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm hover:border-[#0F766E] transition-colors group text-center">
                  <Newspaper className="h-6 w-6 text-[#0F766E] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-[#0F172A]">Legal Feed</span>
                </Link>
              </div>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h2 className="text-lg font-semibold serif text-[#0F172A] flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> Saved Advocates
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  {savedAdvocates.map((adv) => (
                    <div key={adv.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                      <div className="bg-white p-2 rounded-full border border-slate-200">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#0F172A] truncate">{adv.name}</h4>
                        <p className="text-xs text-slate-500">{adv.spec} · {adv.location}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#B45309] transition-colors" />
                    </div>
                  ))}
                  <Link to="/advocates">
                    <Button variant="ghost" className="w-full text-xs text-slate-500 hover:text-[#B45309]">View more in directory</Button>
                  </Link>
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold serif text-[#0F172A] flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#B45309]" /> Legal Wallet
                  </h2>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">BETA</span>
                </div>
                <div className="p-8 text-center space-y-3">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm py-8 px-4">
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Securely store and share case documents with your advocates.
                    </p>
                    <Button disabled variant="outline" size="sm" className="h-9 rounded-sm text-xs border-slate-300 text-slate-400">
                      Upload Document
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                    <CheckCircle2 className="h-3 w-3" /> Encrypted & Private
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-[#B45309] to-[#92400E] text-white rounded-sm p-6 shadow-md">
                <h3 className="font-semibold serif text-xl mb-2">Legal Awareness</h3>
                <p className="text-xs text-amber-100 leading-relaxed mb-4">
                  Stay updated with the latest news on Tenant Rights, FIR processes, and Consumer Protection.
                </p>
                <Link to="/feed">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#B45309] h-10 rounded-sm text-xs font-medium">
                    Browse Latest Posts
                  </Button>
                </Link>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
