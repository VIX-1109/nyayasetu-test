import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Scale, Calendar, CheckCircle2, Clock, Newspaper, PenLine } from 'lucide-react';
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
        .select('*')
        .eq('advocate_id', user.id);
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
      toast.success('Profile created successfully!');
      setShowProfileDialog(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to create profile');
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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
            <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">
              AI Learning
            </Link>
            <Link to="/feed" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Justice Feed
            </Link>
            <Button onClick={logout} variant="ghost" className="text-slate-700">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="ns-page">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="ns-heading-xl mb-2" data-testid="advocate-dashboard-title">
              Welcome, {user.name}
            </h1>
            <p className="text-lg text-slate-600">Manage your profile and appointments</p>
          </div>

          {profile && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8 mb-8" data-testid="profile-status-card">
              <div className="ns-nav-inner">
                <div>
                  <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-2">Profile Status</h2>
                  <div className="flex items-center gap-2">
                    {profile.verification_status === 'verified' ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-sm" data-testid="verified-status">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-sm" data-testid="pending-status">
                        <Clock className="h-4 w-4" />
                        Pending Verification
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Bar Council: {profile.bar_council_number}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6" data-testid="total-appointments-advocate-card">
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
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6" data-testid="pending-appointments-advocate-card">
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
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6" data-testid="confirmed-appointments-advocate-card">
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

          <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-center gap-2 text-[#B45309] font-medium mb-2">
                  <Newspaper className="h-5 w-5" />
                  Professional visibility
                </div>
                <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-3">Build trust through legal awareness</h2>
                <p className="text-slate-600 leading-relaxed">
                  Publish short explainers and justice updates so clients can understand your expertise before requesting a consultation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <Link to="/feed">
                  <Button className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-11 px-6 rounded-sm">
                    <PenLine className="mr-2 h-4 w-4" />
                    Write on Feed
                  </Button>
                </Link>
                {profile && (
                  <Link to={`/advocates/${user.id}`}>
                    <Button variant="outline" className="h-11 px-6 rounded-sm">View Public Profile</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-6">Appointment Requests</h2>
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-slate-600" data-testid="no-appointments-advocate">
                No appointments yet
              </div>
            ) : (
              <div className="space-y-4" data-testid="appointments-advocate-list">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-slate-200 rounded-sm p-6 hover:shadow-md transition-shadow" data-testid={`appointment-advocate-${appointment.id}`}>
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
                        }`}>
                          {appointment.status.toUpperCase()}
                        </span>
                      </div>
                      {appointment.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                            data-testid={`confirm-btn-${appointment.id}`}
                            className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 px-6 rounded-sm"
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                            data-testid={`cancel-btn-${appointment.id}`}
                            variant="outline"
                            className="h-10 px-6 rounded-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Inbox emptyHint="Client messages will appear here. Once a client messages you, you can reply directly." />
        </div>
      </div>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent data-testid="create-profile-dialog">
          <DialogHeader>
            <DialogTitle className="serif text-2xl">Create Your Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <Label htmlFor="bar_council_number">Bar Council Number</Label>
              <Input
                id="bar_council_number"
                data-testid="bar-council-input"
                value={profileData.bar_council_number}
                onChange={(e) => setProfileData({...profileData, bar_council_number: e.target.value})}
                required
                className="h-12 rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="specializations">Specializations (comma-separated)</Label>
              <Input
                id="specializations"
                data-testid="specializations-input"
                value={profileData.specializations}
                onChange={(e) => setProfileData({...profileData, specializations: e.target.value})}
                required
                placeholder="Civil Litigation, Criminal Law"
                className="h-12 rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                data-testid="experience-input"
                value={profileData.experience_years}
                onChange={(e) => setProfileData({...profileData, experience_years: e.target.value})}
                required
                className="h-12 rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                data-testid="location-profile-input"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                required
                placeholder="Delhi, High Court"
                className="h-12 rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                data-testid="phone-input"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                required
                placeholder="+91-XXXXXXXXXX"
                className="h-12 rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                data-testid="about-input"
                value={profileData.about}
                onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                required
                placeholder="Brief description about your practice"
                className="rounded-sm"
                rows={4}
              />
            </div>
            <Button
              type="submit"
              data-testid="create-profile-btn"
              className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm"
            >
              Create Profile
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvocateDashboard;


