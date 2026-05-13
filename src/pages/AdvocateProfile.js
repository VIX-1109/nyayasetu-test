import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, CheckCircle2, Briefcase, MapPin, Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdvocateProfile = ({ user, logout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('Property Law');
  const [mode, setMode] = useState('Chat');
  const [urgency, setUrgency] = useState('Normal');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchAdvocate();
  }, [id]);

  const fetchAdvocate = async () => {
    try {
      const { data, error } = await supabase
        .from('advocates')
        .select('*, profiles!inner(name, role)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setAdvocate({
        ...data,
        name: data.profiles.name
      });
    } catch (error) {
      toast.error('Failed to load advocate profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/auth');
      return;
    }
    if (user.role !== 'client') {
      toast.error('Only clients can book appointments');
      return;
    }

    setBookingLoading(true);
    try {
      const intakeDescription = [
        `Category: ${category}`,
        `Mode: ${mode}`,
        `Urgency: ${urgency}`,
        `City/State: ${city || advocate.location || 'Not provided'}`,
        '',
        'Issue summary:',
        description
      ].join('\n');

      const { error } = await supabase.from('appointments').insert({
        advocate_id: id,
        client_id: user.id,
        date,
        time,
        description: intakeDescription,
        status: 'pending'
      });
      if (error) throw error;
      toast.success('Consultation request sent successfully!');
      setShowBooking(false);
      setDate('');
      setTime('');
      setCategory('Property Law');
      setMode('Chat');
      setUrgency('Normal');
      setCity('');
      setDescription('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleMessage = () => {
    if (!user) {
      toast.error('Please login to send a message');
      navigate('/auth');
      return;
    }
    navigate(`/messages/${advocate.id}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!advocate) {
    return <div className="flex items-center justify-center h-screen">Advocate not found</div>;
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
            <Link to="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">
              All Advocates
            </Link>
            {user && (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'}>
                  <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={logout} variant="ghost" className="text-slate-700">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="ns-page">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8 mb-8" data-testid="advocate-header">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="ns-heading-xl mb-2">
                      {advocate.name}
                    </h1>
                    <p className="text-base text-slate-600 mono mb-4">
                      Bar Council: {advocate.bar_council_number}
                    </p>
                    <div className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-sm w-fit" data-testid="profile-verified-badge">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified Advocate
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-[#B45309]" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-slate-600">Experience</p>
                      <p className="text-sm font-medium text-slate-900">{advocate.experience_years} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#B45309]" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="text-sm font-medium text-slate-900">{advocate.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#B45309]" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-slate-600">Contact</p>
                      <p className="text-sm font-medium text-slate-900">{advocate.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {advocate.specializations.map((spec, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-4 py-2 text-sm font-medium rounded-sm border border-slate-200">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
                  <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="bg-white border border-slate-200 shadow-sm rounded-sm p-8">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-4">About</h2>
                  <p className="text-base leading-relaxed text-slate-700">
                    {advocate.about || 'No additional information provided.'}
                  </p>
                </TabsContent>
                <TabsContent value="contact" className="bg-white border border-slate-200 shadow-sm rounded-sm p-8">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#B45309]" strokeWidth={1.5} />
                      <span className="text-base text-slate-700">{advocate.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#B45309]" strokeWidth={1.5} />
                      <span className="text-base text-slate-700">{advocate.email}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-5 sm:p-6 lg:sticky lg:top-6">
                <h3 className="text-xl font-semibold serif text-[#0F172A] mb-6">Request Consultation</h3>
                <div className="space-y-3">
                  <Dialog open={showBooking} onOpenChange={setShowBooking}>
                    <DialogTrigger asChild>
                      <Button data-testid="book-appointment-btn" className="w-full bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 rounded-sm font-medium">
                        <Calendar className="mr-2 h-5 w-5" />
                        Request Consultation
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="booking-dialog">
                      <DialogHeader>
                        <DialogTitle className="serif text-2xl">Consultation Intake</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleBookAppointment} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Legal Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger className="h-12 rounded-sm bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Property Law">Property Law</SelectItem>
                                <SelectItem value="Family Law">Family Law</SelectItem>
                                <SelectItem value="Consumer Rights">Consumer Rights</SelectItem>
                                <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                                <SelectItem value="Employment">Employment</SelectItem>
                                <SelectItem value="Civil Litigation">Civil Litigation</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Preferred Mode</Label>
                            <Select value={mode} onValueChange={setMode}>
                              <SelectTrigger className="h-12 rounded-sm bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Chat">Chat</SelectItem>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="In-person">In-person</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Urgency</Label>
                            <Select value={urgency} onValueChange={setUrgency}>
                              <SelectTrigger className="h-12 rounded-sm bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="This week">This week</SelectItem>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="city">City / State</Label>
                            <Input
                              id="city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="Mumbai, Maharashtra"
                              className="h-12 rounded-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input
                            id="date"
                            type="date"
                            data-testid="appointment-date-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="h-12 rounded-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Preferred Time</Label>
                          <Input
                            id="time"
                            type="time"
                            data-testid="appointment-time-input"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="h-12 rounded-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Issue Summary</Label>
                          <Textarea
                            id="description"
                            data-testid="appointment-description-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Briefly describe your legal matter. Do not include sensitive names, private addresses, or full case documents here."
                            className="rounded-sm"
                            rows={4}
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={bookingLoading}
                          data-testid="confirm-booking-btn"
                          className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm"
                        >
                          {bookingLoading ? 'Sending...' : 'Send Consultation Request'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleMessage}
                    data-testid="send-message-btn"
                    variant="outline"
                    className="w-full bg-white border-2 border-[#0F172A]/10 text-[#0F172A] hover:bg-slate-50 h-12 rounded-sm font-medium"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateProfile;


