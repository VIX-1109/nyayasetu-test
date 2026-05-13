import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Scale, Calendar, BookOpen, Newspaper } from 'lucide-react';
import { toast } from 'sonner';
import { Inbox } from '@/components/Inbox';

const ClientDashboard = ({ user, logout }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', user.id);
      if (error) throw error;
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link to="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Find Advocates
            </Link>
            <Link to="/feed" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Justice Feed
            </Link>
            <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">
              AI Learning
            </Link>
            <Button data-testid="logout-dashboard-btn" onClick={logout} variant="ghost" className="text-slate-700">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="ns-page">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="ns-heading-xl mb-2" data-testid="client-dashboard-title">
              Welcome, {user.name}
            </h1>
            <p className="text-lg text-slate-600">Manage your appointments and consultations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6" data-testid="total-appointments-card">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="bg-[#0F172A] p-3 rounded-sm">
                  <Calendar className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Appointments</p>
                  <p className="text-2xl font-bold serif text-[#0F172A]">{appointments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6" data-testid="pending-appointments-card">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="bg-[#B45309] p-3 rounded-sm">
                  <Calendar className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold serif text-[#0F172A]">
                    {appointments.filter(a => a.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6" data-testid="confirmed-appointments-card">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="bg-[#0F766E] p-3 rounded-sm">
                  <Calendar className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Confirmed</p>
                  <p className="text-2xl font-bold serif text-[#0F172A]">
                    {appointments.filter(a => a.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#0F766E] p-3 rounded-sm">
                  <BookOpen className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold serif text-[#0F172A] mb-2">Understand Your Legal Issue</h2>
                  <p className="text-sm text-slate-600 mb-4">
                    Ask the AI assistant for general legal information, then connect with a verified advocate for your facts.
                  </p>
                  <Link to="/ai-learning">
                    <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-5 rounded-sm">Ask AI</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#B45309] p-3 rounded-sm">
                  <Newspaper className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold serif text-[#0F172A] mb-2">Justice Feed</h2>
                  <p className="text-sm text-slate-600 mb-4">
                    Read legal awareness posts, justice news explainers, and safe help requests from the NyayaSetu network.
                  </p>
                  <Link to="/feed">
                    <Button variant="outline" className="h-10 px-5 rounded-sm">Open Feed</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-6">My Appointments</h2>
            {loading ? (
              <div className="text-center py-8">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8" data-testid="no-appointments">
                <p className="text-slate-600 mb-4">No appointments yet</p>
                <Link to="/advocates">
                  <Button data-testid="find-advocate-dashboard-btn" className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-8 rounded-sm font-medium">
                    Find an Advocate
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4" data-testid="appointments-list">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-slate-200 rounded-sm p-6 hover:shadow-md transition-shadow" data-testid={`appointment-${appointment.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="h-5 w-5 text-[#B45309]" strokeWidth={1.5} />
                          <span className="font-medium text-[#0F172A]">{appointment.date} at {appointment.time}</span>
                        </div>
                        <p className="text-slate-700 mb-2">{appointment.description}</p>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-sm ${
                          appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`} data-testid={`status-${appointment.status}`}>
                          {appointment.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Inbox emptyHint="When you message an advocate, your conversation will appear here." />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

