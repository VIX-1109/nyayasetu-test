import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, CheckCircle2, Briefcase, MapPin, Phone, Mail, MessageCircle, Calendar, ArrowLeft, Star, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AccountMenu from '@/components/AccountMenu';
import { createAppointment } from '@/services/appointmentService';
import { buildAppointmentPayload } from '@/lib/appointmentBooking';

// Skeleton loader
const SkeletonProfile = () => (
  <div className="animate-pulse">
    <div className="w-full px-6 py-16" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white/10" />
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-5 w-24 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
    <div className="ns-page">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm p-8 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-sm" />
              ))}
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-slate-100 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-3">
            <div className="h-12 bg-slate-100 rounded-sm" />
            <div className="h-12 bg-slate-100 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdvocateProfile = ({ user, logout, advocateId }) => {
  const id = advocateId;
  const router = useRouter();
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
      setAdvocate({ ...data, name: data.profiles.name });
    } catch (error) {
      toast.error('Failed to load advocate profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book an appointment'); router.push('/auth'); return; }
    if (user.role !== 'client') { toast.error('Only clients can book appointments'); return; }

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

      await createAppointment(buildAppointmentPayload({
        advocateId: id, clientId: user.id,
        date, time, mode, intakeDescription,
      }));

      toast.success('Consultation request sent successfully!');
      setShowBooking(false);
      setDate(''); setTime(''); setCategory('Property Law');
      setMode('Chat'); setUrgency('Normal'); setCity(''); setDescription('');
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleMessage = () => {
    if (!user) { toast.error('Please login to send a message'); router.push('/auth'); return; }
    router.push(`/messages/${advocate.id}`);
  };

  if (loading) return <SkeletonProfile />;

  if (!advocate) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-slate-500">Advocate not found</p>
      <Link href="/advocates"><Button variant="outline" className="rounded-sm">Back to Directory</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Nav */}
      <nav className="ns-nav sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/advocates" className="flex items-center gap-1.5 text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">
              <ArrowLeft className="h-4 w-4" /> All Advocates
            </Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div
        className="w-full px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <Scale className="absolute -right-12 -bottom-12 h-64 w-64 text-white/5" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#B45309]/20 border-2 border-[#B45309]/40 flex items-center justify-center shrink-0">
            <span className="text-3xl font-black text-[#B45309]">{advocate.name?.[0]}</span>
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold serif text-white" data-testid="advocate-name">
                {advocate.name}
              </h1>
              {advocate.verification_status === 'verified' && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-900/40 border border-emerald-700 text-emerald-400 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full" data-testid="profile-verified-badge">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm font-mono">Bar Council: {advocate.bar_council_number}</p>
            <div className="flex flex-wrap gap-4 pt-1">
              <span className="flex items-center gap-1.5 text-slate-300 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-[#B45309]" /> {advocate.experience_years} years experience
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 text-sm">
                <MapPin className="h-3.5 w-3.5 text-[#B45309]" /> {advocate.location}
              </span>
            </div>
          </div>
          {/* Quick action buttons in hero */}
          <div className="flex flex-col gap-2 shrink-0">
            <Dialog open={showBooking} onOpenChange={setShowBooking}>
              <DialogTrigger asChild>
                <Button data-testid="book-appointment-btn" className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-11 px-6 rounded-sm font-bold">
                  <Calendar className="mr-2 h-4 w-4" /> Book Consultation
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button
              onClick={handleMessage}
              data-testid="send-message-btn"
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white hover:text-[#0F172A] h-11 px-6 rounded-sm font-bold transition-all"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </div>
        </div>
      </div>

      <div className="ns-page">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left — main content */}
            <div className="lg:col-span-8 space-y-6">

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Briefcase, label: 'Experience', value: `${advocate.experience_years} yrs`, color: 'text-[#B45309] bg-[#B45309]/10' },
                  { icon: MapPin, label: 'Location', value: advocate.location, color: 'text-emerald-600 bg-emerald-50' },
                  { icon: Shield, label: 'Status', value: advocate.verification_status === 'verified' ? 'Verified' : 'Pending', color: 'text-blue-600 bg-blue-50' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex items-center gap-3">
                    <div className={`p-2 rounded-sm ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                      <p className="text-sm font-bold text-[#0F172A] truncate">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specializations */}
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100" style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}>
                  <h3 className="font-bold serif text-[#0F172A] flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#B45309]" /> Specializations
                  </h3>
                </div>
                <div className="p-6 flex flex-wrap gap-2">
                  {advocate.specializations?.map((spec, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold rounded-full border border-slate-200 hover:border-[#B45309]/40 hover:bg-[#B45309]/5 transition-colors">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-sm w-fit mb-4">
                  <TabsTrigger value="about" data-testid="tab-about" className="rounded-sm px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">About</TabsTrigger>
                  <TabsTrigger value="contact" data-testid="tab-contact" className="rounded-sm px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100" style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}>
                      <h2 className="font-bold serif text-[#0F172A]">About {advocate.name}</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-base leading-relaxed text-slate-700">
                        {advocate.about || 'No additional information provided by this advocate.'}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact">
                  <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100" style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}>
                      <h2 className="font-bold serif text-[#0F172A]">Contact Information</h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-sm">
                        <div className="bg-[#B45309]/10 p-2 rounded-sm">
                          <Phone className="h-4 w-4 text-[#B45309]" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Phone</p>
                          <p className="text-sm font-bold text-[#0F172A]">{advocate.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-sm">
                        <div className="bg-[#B45309]/10 p-2 rounded-sm">
                          <Mail className="h-4 w-4 text-[#B45309]" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Email</p>
                          <p className="text-sm font-bold text-[#0F172A]">{advocate.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right — sticky sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden lg:sticky lg:top-24">
                <div
                  className="px-6 py-5 border-b border-slate-100"
                  style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}
                >
                  <h3 className="font-bold serif text-[#0F172A]">Request Consultation</h3>
                  <p className="text-xs text-slate-500 mt-1">Free consultation request — no payment required</p>
                </div>
                <div className="p-5 space-y-3">
                  <Dialog open={showBooking} onOpenChange={setShowBooking}>
                    <DialogTrigger asChild>
                      <Button data-testid="book-appointment-btn-sidebar" className="w-full bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 rounded-sm font-bold shadow-sm">
                        <Calendar className="mr-2 h-4 w-4" /> Book Consultation
                      </Button>
                    </DialogTrigger>

                    {/* Booking Dialog */}
                    <DialogContent className="sm:max-w-xl rounded-sm p-0 overflow-hidden" data-testid="booking-dialog">
                      <DialogHeader
                        className="px-6 py-5 border-b border-slate-100"
                        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
                      >
                        <DialogTitle className="serif text-xl text-white flex items-center gap-3">
                          <div className="bg-[#B45309]/20 p-2 rounded-sm">
                            <Calendar className="h-4 w-4 text-[#B45309]" />
                          </div>
                          Consultation Request — {advocate.name}
                        </DialogTitle>
                      </DialogHeader>

                      <form onSubmit={handleBookAppointment} className="px-6 py-6 space-y-6">

                        {/* Section 1 — Case Details */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Case Details</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal Category</Label>
                              <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-10 rounded-sm bg-slate-50">
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
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Urgency</Label>
                              <Select value={urgency} onValueChange={setUrgency}>
                                <SelectTrigger className="h-10 rounded-sm bg-slate-50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Normal">Normal</SelectItem>
                                  <SelectItem value="This week">This week</SelectItem>
                                  <SelectItem value="Urgent">Urgent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Issue Summary</Label>
                            <Textarea
                              id="description"
                              data-testid="appointment-description-input"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              required
                              placeholder="Briefly describe your legal matter. Do not include sensitive names, private addresses, or full case documents here."
                              className="rounded-sm bg-slate-50 resize-none text-sm border-slate-200 focus:border-[#0F172A]"
                              rows={4}
                            />
                            <p className="text-[10px] text-slate-400">Keep this brief — full details can be shared in your private consultation.</p>
                          </div>
                        </div>

                        {/* Section 2 — Scheduling */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Scheduling & Mode</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Preferred Date</Label>
                              <Input
                                id="date"
                                type="date"
                                data-testid="appointment-date-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="h-10 rounded-sm bg-slate-50 border-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Preferred Time</Label>
                              <Input
                                id="time"
                                type="time"
                                data-testid="appointment-time-input"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                                className="h-10 rounded-sm bg-slate-50 border-slate-200"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Consultation Mode</Label>
                              <Select value={mode} onValueChange={setMode}>
                                <SelectTrigger className="h-10 rounded-sm bg-slate-50">
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
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your City / State</Label>
                              <Input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Mumbai, Maharashtra"
                                className="h-10 rounded-sm bg-slate-50 border-slate-200"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Submit */}
                        <Button
                          type="submit"
                          disabled={bookingLoading}
                          data-testid="confirm-booking-btn"
                          className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-bold shadow-md"
                        >
                          {bookingLoading ? 'Sending Request...' : 'Send Consultation Request →'}
                        </Button>
                        <p className="text-[10px] text-slate-400 text-center">
                          Your request will be reviewed by the advocate. No payment is collected at this stage.
                        </p>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleMessage}
                    data-testid="send-message-btn"
                    variant="outline"
                    className="w-full border-2 border-slate-200 text-[#0F172A] hover:bg-slate-50 h-12 rounded-sm font-bold"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </div>

                {/* Trust signals */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  {[
                    { icon: Shield, text: 'Admin verified advocate' },
                    { icon: Clock, text: 'Responds within 24 hours' },
                    { icon: CheckCircle2, text: 'No payment at booking stage' },
                  ].map((trust) => (
                    <div key={trust.text} className="flex items-center gap-2">
                      <trust.icon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs text-slate-500">{trust.text}</span>
                    </div>
                  ))}
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
