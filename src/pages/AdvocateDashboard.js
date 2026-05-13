import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Scale, Calendar, CheckCircle2, Clock, Newspaper, Pen, User, BarChart3, MessageSquare, AlertCircle, Eye, TrendingUp, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Inbox } from '@/components/Inbox';

const AdvocateDashboard = ({ user, logout }) => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    bar_council_number: '',
    specializations: '',
    experience_years: '',
    location: '',
    about: '',
    phone: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('advocates')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          setShowProfileDialog(true);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
        setProfileData({
          bar_council_number: data.bar_council_number || '',
          specializations: data.specializations?.join(', ') || '',
          experience_years: data.experience_years || '',
          location: data.location || '',
          about: data.about || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, profiles(name)')
        .eq('advocate_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments');
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = {
        id: user.id,
        ...profileData,
        specializations: profileData.specializations.split(',').map(s => s.trim()),
        experience_years: parseInt(profileData.experience_years)
      };
      const { error } = await supabase.from('advocates').upsert(data);
      if (error) throw error;
      toast.success('Profile updated successfully!');
      setShowProfileDialog(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', appointmentId);
      if (error) throw error;
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = ['bar_council_number', 'specializations', 'experience_years', 'location', 'about', 'phone'];
    const completed = fields.filter(f => profile[f] && (Array.isArray(profile[f]) ? profile[f].length > 0 : true)).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link to="/feed" className="text-slate-700 hover:text-[#0F172A] font-medium">Justice Feed</Link>
            <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">AI Learning</Link>
            <Button onClick={logout} variant="ghost" className="text-slate-700">Logout</Button>
          </div>
        </div>
      </nav>

      <main className="ns-page">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold serif text-[#0F172A]">Advocate Console</h1>
              <p className="text-slate-600 mt-1">Welcome, {user.name}. Manage your practice and visibility.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-sm border flex items-center gap-2 ${
                profile?.verification_status === 'verified' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                {profile?.verification_status === 'verified' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                <span className="text-sm font-bold uppercase tracking-wider">
                  {profile?.verification_status || 'Unverified'}
                </span>
              </div>
              <Button onClick={() => setShowProfileDialog(true)} variant="outline" className="rounded-sm border-slate-200">
                <Settings className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-4 space-y-8">
              
              <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
                <h3 className="text-lg font-semibold serif text-[#0F172A] mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#B45309]" /> Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <Eye className="h-4 w-4 text-slate-400" />
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold serif text-[#0F172A]">428</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Profile Views</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold serif text-[#0F172A]">12</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">New Leads</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-[#0F766E]/5 border border-[#0F766E]/10 rounded-sm flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold serif text-[#0F766E]">{appointments.filter(a => a.status === 'confirmed').length}</p>
                    <p className="text-[10px] text-[#0F766E] uppercase font-bold tracking-tighter">Completed Consults</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-[#0F766E]/20" />
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
                <h3 className="text-lg font-semibold serif text-[#0F172A] mb-4">Profile Completion</h3>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#B45309] transition-all duration-1000" 
                      style={{ width: `${calculateProfileCompletion()}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{calculateProfileCompletion()}% Complete</p>
                  {calculateProfileCompletion() < 100 && (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-sm flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-800">Complete your profile to increase visibility in search results.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-[#B45309] text-white rounded-sm p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Newspaper className="h-6 w-6" />
                  <h3 className="font-semibold serif text-xl">Legal Awareness</h3>
                </div>
                <p className="text-sm text-amber-50/80 leading-relaxed mb-6">
                  Build authority by sharing legal explainers and insights on the public feed.
                </p>
                <Link to="/feed">
                  <Button className="w-full bg-white text-[#B45309] hover:bg-white/90 h-11 rounded-sm font-bold flex items-center justify-center">
                    <Pen className="h-4 w-4 mr-2" /> Write Post
                  </Button>
                </Link>
              </section>
            </div>

            <div className="lg:col-span-8 space-y-8">
              
              <section className="bg-white border border-slate-200 rounded-sm shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A]">Consultation Requests</h2>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold rounded-full">
                    {appointments.length} Total
                  </span>
                </div>
                
                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {appointments.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                      <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                      No requests yet.
                    </div>
                  ) : (
                    appointments.map((app) => (
                      <div key={app.id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-[#0F172A] text-lg">{app.profiles?.name || 'Citizen'}</h4>
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                                app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                app.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-slate-50 text-slate-600 border-slate-100'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {app.date}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {app.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 max-w-xl line-clamp-2">{app.description}</p>
                          </div>
                          
                          {app.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => handleUpdateAppointmentStatus(app.id, 'confirmed')}
                                className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 px-6 rounded-sm shadow-sm"
                              >
                                Accept
                              </Button>
                              <Button 
                                onClick={() => handleUpdateAppointmentStatus(app.id, 'cancelled')}
                                variant="outline" 
                                className="h-10 px-6 rounded-sm border-slate-200"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A]">Recent Messages</h2>
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                </div>
                <div className="p-0">
                  <Inbox emptyHint="Citizen messages will appear here. Respond quickly to build trust." />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm">
          <DialogHeader>
            <DialogTitle className="serif text-2xl">Manage Professional Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProfile} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bar_council_number">Bar Council Number</Label>
                <Input
                  id="bar_council_number"
                  value={profileData.bar_council_number}
                  onChange={(e) => setProfileData({...profileData, bar_council_number: e.target.value})}
                  required
                  className="h-11 rounded-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  required
                  className="h-11 rounded-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specializations">Specializations (comma separated)</Label>
              <Input
                id="specializations"
                value={profileData.specializations}
                onChange={(e) => setProfileData({...profileData, specializations: e.target.value})}
                required
                placeholder="Civil Litigation, Criminal Law, Family Law"
                className="h-11 rounded-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={profileData.experience_years}
                  onChange={(e) => setProfileData({...profileData, experience_years: e.target.value})}
                  required
                  className="h-11 rounded-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (City, State)</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  required
                  className="h-11 rounded-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about">Professional Bio / About</Label>
              <Textarea
                id="about"
                value={profileData.about}
                onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                required
                rows={5}
                className="rounded-sm"
                placeholder="Describe your legal background, notable cases, and consultation approach..."
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-bold shadow-md"
            >
              Update Profile Information
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvocateDashboard;
