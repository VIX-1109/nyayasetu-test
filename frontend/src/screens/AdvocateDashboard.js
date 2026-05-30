"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Scale, Calendar, CheckCircle2, Clock, Newspaper, Pen, User, BarChart3, MessageSquare, AlertCircle, Eye, TrendingUp, Settings, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Inbox } from '@/components/Inbox';
import { useAdvocateDashboard } from '@/hooks/useAdvocateDashboard';
import AccountMenu from '@/components/AccountMenu';

const getAppointmentDisplayStatus = (app) => {
  let displayStatus = app.status;
  if (!app.date) return displayStatus;

  const apptDate = new Date(`${app.date}T${app.time || '00:00'}`);
  const now = new Date();
  if (app.status === 'completed' && apptDate > now) {
    displayStatus = 'confirmed';
  } else if (app.status === 'confirmed' && apptDate < now) {
    displayStatus = 'completed';
  }
  return displayStatus;
};

const getStatusBadgeClass = (displayStatus) => {
  if (displayStatus === 'confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (displayStatus === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (displayStatus === 'completed') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (displayStatus === 'cancelled') return 'bg-red-50 text-red-700 border-red-100';
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

const AdvocateDashboard = ({ user, logout }) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [appointmentDetailOpen, setAppointmentDetailOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [blockedDays, setBlockedDays] = useState([]);
  const [dayNotes, setDayNotes] = useState({});
  const [currentNote, setCurrentNote] = useState("");
  const [offlineAppointments, setOfflineAppointments] = useState([]);
  const [newApptName, setNewApptName] = useState("");
  const [newApptTime, setNewApptTime] = useState("");
  const [newApptDesc, setNewApptDesc] = useState("");
  const {
    profile, appointments, loading,
    showProfileDialog, setShowProfileDialog,
    profileData, setProfileData,
    handleCreateProfile,
    handleUpdateAppointmentStatus,
    calculateProfileCompletion
  } = useAdvocateDashboard(user);

  useEffect(() => {
    if (!selectedAppointment?.id) return;
    const updated = appointments.find((app) => app.id === selectedAppointment.id);
    if (updated) {
      setSelectedAppointment(updated);
    }
  }, [appointments, selectedAppointment?.id]);

  const openAppointmentDetails = (app) => {
    setSelectedAppointment(app);
    setAppointmentDetailOpen(true);
  };

  const handleMessageClient = (clientId) => {
    if (!clientId) return;
    setAppointmentDetailOpen(false);
    router.push(`/messages/${clientId}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50">Loading Dashboard...</div>;
  }

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setCurrentNote(dayNotes[date.toDateString()] || "");
  };

  const handleSaveDay = () => {
    if (selectedDate) {
      setDayNotes(prev => ({ ...prev, [selectedDate.toDateString()]: currentNote }));
    }
  };

  const toggleBlockDay = () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toDateString();
    setBlockedDays(prev => 
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  const handleAddOfflineAppointment = () => {
    if (!newApptName || !newApptTime || !selectedDate) return;
    const offset = selectedDate.getTimezoneOffset();
    const dateStr = new Date(selectedDate.getTime() - (offset*60*1000)).toISOString().split('T')[0];
    const newAppt = {
      id: 'offline-' + Date.now(),
      profiles: { name: newApptName + ' (Offline)' },
      date: dateStr,
      time: newApptTime,
      description: newApptDesc,
      status: 'confirmed'
    };
    setOfflineAppointments(prev => [...prev, newAppt]);
    setNewApptName("");
    setNewApptTime("");
    setNewApptDesc("");
  };

  const isSelectedBlocked = selectedDate ? blockedDays.includes(selectedDate.toDateString()) : false;
  const selectedNote = selectedDate ? dayNotes[selectedDate.toDateString()] : "";
  const allAppointments = [...appointments, ...offlineAppointments];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/feed" className="text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">Justice Feed</Link>
            <Link href="/ai-learning" className="text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">AI Learning</Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>

      {/* ── DASHBOARD HERO BANNER ── */}
      <div
        className="w-full px-4 sm:px-6 md:px-12 lg:px-24 py-10 md:py-14"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#B45309] flex items-center justify-center text-white text-xl font-black">
                {user.name?.[0] || 'A'}
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Advocate Console</p>
                <h1 className="text-3xl md:text-4xl font-bold serif text-white leading-tight">Welcome, {user.name}</h1>
              </div>
            </div>
            <p className="text-slate-400 text-sm pl-15">Manage your practice, consultations, and visibility across India.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`px-4 py-2 rounded-sm border flex items-center gap-2 ${
              profile?.verification_status === 'verified'
                ? 'bg-emerald-900/40 border-emerald-700 text-emerald-400'
                : 'bg-amber-900/40 border-amber-700 text-amber-400'
            }`}>
              {profile?.verification_status === 'verified' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              <span className="text-sm font-bold uppercase tracking-wider">
                {profile?.verification_status || 'Unverified'}
              </span>
            </div>
            <Button onClick={() => setShowProfileDialog(true)} className="rounded-sm bg-white/10 border border-white/20 text-white hover:bg-white hover:text-[#0F172A] transition-all">
              <Settings className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile completion bar in header */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Profile Strength</span>
            <span className="text-xs font-bold text-white">{calculateProfileCompletion()}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B45309] rounded-full transition-all duration-1000"
              style={{ width: `${calculateProfileCompletion()}%` }}
            />
          </div>
        </div>
      </div>

      <main className="ns-page">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-4 space-y-8">
              
              <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
                <h3 className="text-lg font-semibold serif text-[#0F172A] mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#B45309]" /> Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <Eye className="h-4 w-4 text-slate-400" />
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" />+12%</span>
                    </div>
                    <p className="text-3xl font-black text-[#0F172A]">428</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">Profile Views</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" />+3</span>
                    </div>
                    <p className="text-3xl font-black text-[#0F172A]">12</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">New Leads</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-[#0F766E]/10 to-[#0F766E]/5 border border-[#0F766E]/20 rounded-sm flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black text-[#0F766E]">{allAppointments.filter(a => a.status === 'confirmed').length}</p>
                    <p className="text-[10px] text-[#0F766E] uppercase font-bold tracking-tighter mt-1">Confirmed Consults</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-[#0F766E]/20" />
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
                <h3 className="text-lg font-semibold serif text-[#0F172A] mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" /> Profile Tips
                </h3>
                <div className="space-y-3">
                  {calculateProfileCompletion() < 100 ? (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-sm flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 leading-relaxed">Complete your profile to increase visibility in search results and build client trust.</p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-sm flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-800 leading-relaxed">Your profile is complete. You're fully visible in the advocate directory.</p>
                    </div>
                  )}
                  <button onClick={() => setShowProfileDialog(true)} className="w-full text-left text-xs text-[#B45309] font-semibold hover:underline flex items-center gap-1">
                    <Settings className="h-3 w-3" /> Update profile details
                  </button>
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
                <Link href="/feed">
                  <Button className="w-full bg-white text-[#B45309] hover:bg-white/90 h-11 rounded-sm font-bold flex items-center justify-center">
                    <Pen className="h-4 w-4 mr-2" /> Write Post
                  </Button>
                </Link>
              </section>
            </div>

            <div className="lg:col-span-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <section className="md:col-span-2 bg-white border border-slate-200 rounded-sm shadow-sm">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold serif text-[#0F172A]">Consultation Requests</h2>
                    <div className="flex items-center gap-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold rounded-full">
                        {allAppointments.length} Total
                      </span>
                      <Button onClick={() => { setCalendarModalOpen(true); handleDateSelect(selectedDate || new Date()); }} className="h-8 bg-[#0F766E] text-white hover:bg-[#0F766E]/90 shadow-sm px-4">
                        <Calendar className="mr-2 h-4 w-4" /> Master Schedule
                      </Button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {allAppointments.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                        No requests yet.
                      </div>
                    ) : (
                      allAppointments.map((app) => {
                        const displayStatus = getAppointmentDisplayStatus(app);
                        const isOffline = String(app.id).startsWith('offline-');

                        return (
                          <div
                            key={app.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => openAppointmentDetails(app)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                openAppointmentDetails(app);
                              }
                            }}
                            className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 border-l-4 border-transparent hover:border-l-4 relative"
                            style={{ borderLeftColor: displayStatus === 'confirmed' ? '#10b981' : displayStatus === 'pending' ? '#f59e0b' : displayStatus === 'cancelled' ? '#ef4444' : '#94a3b8' }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2 min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-bold text-[#0F172A] text-lg">{app.profiles?.name || 'Citizen'}</h4>
                                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${getStatusBadgeClass(displayStatus)}`}>
                                    {displayStatus}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {app.date || 'Date TBD'}</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {app.time || 'Time TBD'}</span>
                                </div>
                                <p className="text-sm text-slate-600 max-w-xl line-clamp-2">{app.description || 'No details provided.'}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                {app.status === 'pending' && !isOffline && (
                                  <>
                                    <Button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleUpdateAppointmentStatus(app.id, 'confirmed');
                                      }}
                                      className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 px-6 rounded-sm shadow-sm"
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleUpdateAppointmentStatus(app.id, 'cancelled');
                                      }}
                                      variant="outline"
                                      className="h-10 px-6 rounded-sm border-slate-200"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {app.client_id && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleMessageClient(app.client_id);
                                    }}
                                    className="h-10 rounded-sm border-slate-200"
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Message
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openAppointmentDetails(app);
                                  }}
                                  className="h-10 text-[#B45309] hover:text-[#B45309]/80"
                                >
                                  View details
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>

                <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-4 flex flex-col items-center h-fit">
                  <h3 className="text-md font-semibold serif text-[#0F172A] mb-4 self-start w-full border-b pb-2">Quick View</h3>
                  <div className="scale-90 origin-top -mt-2 w-full flex justify-center pb-2">
                    <CalendarUI
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => { if (d) { handleDateSelect(d); setCalendarModalOpen(true); } }}
                      className="rounded-md"
                      modifiers={{
                        booked: (date) => allAppointments.some(a => new Date(a.date).toDateString() === date.toDateString() && a.status === 'confirmed'),
                        blocked: (date) => blockedDays.includes(date.toDateString()),
                        hasNote: (date) => !!dayNotes[date.toDateString()]
                      }}
                      modifiersStyles={{
                        booked: { backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 'bold' },
                        blocked: { textDecoration: 'line-through', color: '#64748B', backgroundColor: '#E2E8F0' },
                        hasNote: { backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 'bold' }
                      }}
                    />
                  </div>
                  <Button onClick={() => { handleDateSelect(new Date()); setCalendarModalOpen(true); }} variant="outline" className="w-full h-9 text-xs font-medium border-slate-200 text-slate-700">
                    <Calendar className="mr-2 h-3 w-3 text-[#0F766E]" /> Open Master Schedule
                  </Button>
                </section>
              </div>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A] flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#B45309]" /> Recent Messages
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">Auto-refreshes every 4s</span>
                </div>
                <div className="p-0">
                  <Inbox emptyHint="Citizen messages will appear here. Respond quickly to build trust." />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Dialog
        open={appointmentDetailOpen}
        onOpenChange={(open) => {
          setAppointmentDetailOpen(open);
          if (!open) setSelectedAppointment(null);
        }}
      >
        <DialogContent className="max-w-lg rounded-sm">
          {selectedAppointment && (() => {
            const displayStatus = getAppointmentDisplayStatus(selectedAppointment);
            const isOffline = String(selectedAppointment.id).startsWith('offline-');
            const clientName = selectedAppointment.profiles?.name || 'Citizen';

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="serif text-2xl text-[#0F172A]">Consultation details</DialogTitle>
                  <DialogDescription>
                    Request from {clientName}
                    {isOffline ? ' (offline schedule entry)' : ''}
                  </DialogDescription>
                </DialogHeader>

                {/* Status banner */}
                <div className={`-mx-6 px-6 py-3 flex items-center justify-between border-b ${
                  displayStatus === 'confirmed' ? 'bg-emerald-50 border-emerald-100' :
                  displayStatus === 'pending' ? 'bg-amber-50 border-amber-100' :
                  displayStatus === 'cancelled' ? 'bg-red-50 border-red-100' :
                  'bg-slate-50 border-slate-100'
                }`}>
                  <span className="text-xs text-slate-500 font-medium">Consultation Status</span>
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${getStatusBadgeClass(displayStatus)}`}>
                    {displayStatus}
                  </span>
                </div>

                <div className="space-y-4 py-2">
                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-sm border-2 border-slate-100 bg-slate-50 p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">📅 Date</p>
                      <p className="text-base font-black text-[#0F172A]">{selectedAppointment.date || '—'}</p>
                    </div>
                    <div className="rounded-sm border-2 border-slate-100 bg-slate-50 p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">🕐 Time</p>
                      <p className="text-base font-black text-[#0F172A]">{selectedAppointment.time || '—'}</p>
                    </div>
                  </div>

                  {/* Mode */}
                  {selectedAppointment.mode && (
                    <div className="rounded-sm border border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Consultation Mode</p>
                      <span className="text-sm font-bold capitalize text-[#0F172A] bg-white border border-slate-200 px-3 py-1 rounded-full">{selectedAppointment.mode}</span>
                    </div>
                  )}

                  {/* Case summary */}
                  <div className="rounded-sm border-2 border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">📋 Case Summary</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {selectedAppointment.description || 'No details provided by the client.'}
                      </p>
                    </div>
                  </div>

                  {/* Requested at */}
                  {selectedAppointment.created_at && (
                    <p className="text-xs text-slate-400 text-right">
                      Requested on {new Date(selectedAppointment.created_at).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedAppointment.status === 'pending' && !isOffline && (
                      <>
                        <Button
                          onClick={async () => { await handleUpdateAppointmentStatus(selectedAppointment.id, 'confirmed'); }}
                          className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 px-6 rounded-sm font-bold"
                        >
                          ✓ Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={async () => { await handleUpdateAppointmentStatus(selectedAppointment.id, 'cancelled'); }}
                          className="h-10 px-6 rounded-sm border-red-200 text-red-600 hover:bg-red-50"
                        >
                          ✕ Reject
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {selectedAppointment.client_id ? (
                      <Button
                        type="button"
                        onClick={() => handleMessageClient(selectedAppointment.client_id)}
                        className="h-10 rounded-sm bg-[#0F172A] text-white hover:bg-[#0F172A]/90 font-bold"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message Client
                      </Button>
                    ) : (
                      <p className="text-xs text-slate-400 self-center italic">Messaging only for online bookings.</p>
                    )}
                  </div>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Professional Profile</DialogTitle>
            <DialogDescription>
              Update your identity details, professional specializations, and profile bio.
            </DialogDescription>
          </DialogHeader>
          {/* Modal header */}
          <div
            className="px-8 py-6 border-b border-slate-100"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#B45309]/20 p-2 rounded-sm">
                <Settings className="h-5 w-5 text-[#B45309]" />
              </div>
              <div>
                <h3 className="serif text-xl text-white font-semibold">Professional Profile</h3>
                <p className="text-slate-400 text-xs mt-0.5">This information is shown to clients in the advocate directory</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateProfile} className="px-8 py-6 space-y-6">

            {/* Section: Identity */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Identity & Contact</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bar_council_number" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Bar Council Number</Label>
                  <Input id="bar_council_number" value={profileData.bar_council_number} onChange={(e) => setProfileData({...profileData, bar_council_number: e.target.value})} required className="h-11 rounded-sm border-slate-200 focus:border-[#0F172A]" placeholder="e.g. MH/1234/2018" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</Label>
                  <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} required className="h-11 rounded-sm border-slate-200 focus:border-[#0F172A]" placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            {/* Section: Practice */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Practice Details</p>
              <div className="space-y-1.5">
                <Label htmlFor="specializations" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Specializations</Label>
                <Input id="specializations" value={profileData.specializations} onChange={(e) => setProfileData({...profileData, specializations: e.target.value})} required placeholder="Civil Litigation, Criminal Law, Family Law" className="h-11 rounded-sm border-slate-200 focus:border-[#0F172A]" />
                <p className="text-[10px] text-slate-400">Separate multiple specializations with commas</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="experience_years" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Years of Experience</Label>
                  <Input id="experience_years" type="number" value={profileData.experience_years} onChange={(e) => setProfileData({...profileData, experience_years: e.target.value})} required className="h-11 rounded-sm border-slate-200 focus:border-[#0F172A]" placeholder="e.g. 8" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Location</Label>
                  <Input id="location" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} required className="h-11 rounded-sm border-slate-200 focus:border-[#0F172A]" placeholder="e.g. Pune, Maharashtra" />
                </div>
              </div>
            </div>

            {/* Section: Bio */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Professional Bio</p>
              <div className="space-y-1.5">
                <Label htmlFor="about" className="text-xs font-bold text-slate-600 uppercase tracking-wider">About You</Label>
                <Textarea id="about" value={profileData.about} onChange={(e) => setProfileData({...profileData, about: e.target.value})} required rows={4} className="rounded-sm border-slate-200 focus:border-[#0F172A] resize-none" placeholder="Describe your legal background, notable cases, and consultation approach..." />
                <p className="text-[10px] text-slate-400">This is the first thing clients read on your profile</p>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-black shadow-md text-sm tracking-wide">
              Save Profile →
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={calendarModalOpen} onOpenChange={setCalendarModalOpen}>
        <DialogContent className="max-w-5xl rounded-sm p-0 overflow-hidden bg-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Master Schedule</DialogTitle>
            <DialogDescription>
              View and manage consultation bookings, blocked dates, and private notes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:flex-row h-full">

            {/* LEFT — dark calendar panel */}
            <div
              className="w-full md:w-1/2 flex flex-col"
              style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)' }}
            >
              <div className="px-8 pt-8 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-[#0F766E]/20 p-2 rounded-sm">
                    <Calendar className="h-5 w-5 text-[#0F766E]" />
                  </div>
                  <h2 className="text-xl font-bold serif text-white">Master Schedule</h2>
                </div>
                <p className="text-slate-400 text-xs pl-11">Click any date to manage bookings and notes</p>
              </div>

              <div className="px-6 pb-4 flex justify-center">
                <div
                  className="w-full rounded-sm p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <CalendarUI
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md w-full"
                    classNames={{
                      months: 'w-full',
                      month: 'w-full',
                      table: 'w-full',
                      head_row: 'flex w-full justify-between',
                      head_cell: 'text-slate-400 text-xs font-bold uppercase w-9 text-center',
                      row: 'flex w-full justify-between mt-1',
                      cell: 'w-9 h-9 text-center text-sm relative',
                      day: 'w-9 h-9 rounded-sm text-slate-200 hover:bg-white/10 transition-colors font-medium text-sm',
                      day_selected: 'bg-[#B45309] text-white hover:bg-[#B45309]/90 font-bold',
                      day_today: 'border border-[#0F766E] text-[#0F766E] font-bold',
                      day_outside: 'text-slate-600 opacity-40',
                      nav_button: 'text-slate-300 hover:text-white hover:bg-white/10 rounded-sm p-1 transition-colors',
                      caption: 'flex justify-center items-center gap-4 mb-4',
                      caption_label: 'text-white font-bold text-base serif',
                    }}
                    modifiers={{
                      booked: (date) => allAppointments.some(a => new Date(a.date).toDateString() === date.toDateString() && a.status === 'confirmed'),
                      blocked: (date) => blockedDays.includes(date.toDateString()),
                      hasNote: (date) => !!dayNotes[date.toDateString()]
                    }}
                    modifiersStyles={{
                      booked: { backgroundColor: '#064e3b', color: '#6ee7b7', fontWeight: 'bold', borderRadius: '4px' },
                      blocked: { textDecoration: 'line-through', color: '#475569', backgroundColor: '#1e293b' },
                      hasNote: { backgroundColor: '#451a03', color: '#fcd34d', fontWeight: 'bold', borderRadius: '4px' },
                    }}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="px-8 pb-8 mt-auto">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3">Legend</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { color: '#B45309', bg: '#B45309', label: 'Selected' },
                    { color: '#6ee7b7', bg: '#064e3b', label: 'Booked' },
                    { color: '#fcd34d', bg: '#451a03', label: 'Has Note' },
                    { color: '#475569', bg: '#1e293b', label: 'Blocked' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: item.bg, border: `1px solid ${item.color}` }} />
                      <span className="text-slate-400 text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — day detail panel */}
            <div className="w-full md:w-1/2 bg-white overflow-y-auto max-h-[80vh] flex flex-col">

              {/* Date header */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-100 bg-slate-50">
                {selectedDate ? (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#B45309] mb-1">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                    <h3 className="text-2xl font-bold serif text-[#0F172A]">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                    {isSelectedBlocked && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                        🚫 This date is blocked
                      </span>
                    )}
                    {selectedNote && (
                      <span className="inline-flex items-center gap-1 mt-2 ml-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                        📝 Has a note
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-slate-400 text-sm">Select a date on the calendar</p>
                )}
              </div>

              {selectedDate && (
                <div className="px-8 py-6 space-y-6 flex-1">

                  {/* Block/Unblock */}
                  <div className={`flex items-center justify-between p-4 rounded-sm border ${
                    isSelectedBlocked
                      ? 'bg-red-50 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <p className={`font-semibold text-sm ${ isSelectedBlocked ? 'text-red-700' : 'text-slate-800' }`}>
                        {isSelectedBlocked ? '🚫 Date is Blocked' : 'Block this Date'}
                      </p>
                      <p className={`text-xs mt-0.5 ${ isSelectedBlocked ? 'text-red-500' : 'text-slate-500' }`}>
                        {isSelectedBlocked ? 'Click to re-open for bookings.' : 'Prevent new client bookings on this day.'}
                      </p>
                    </div>
                    <Button
                      onClick={toggleBlockDay}
                      size="sm"
                      className={`rounded-sm font-bold shadow-sm ${
                        isSelectedBlocked
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelectedBlocked ? 'Unblock' : 'Block Date'}
                    </Button>
                  </div>

                  {/* Private Note */}
                  <div
                    className="rounded-sm border p-4 space-y-3"
                    style={{ background: '#fffbeb', borderColor: '#fde68a' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📝</span>
                      <Label htmlFor="day_note" className="font-bold text-amber-900 text-sm">Private Note / Reminder</Label>
                    </div>
                    <Textarea
                      id="day_note"
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                      rows={3}
                      className="rounded-sm text-sm bg-white border-amber-200 focus:border-amber-400 resize-none"
                      placeholder="E.g., Court hearing at 10 AM, submit documents by EOD..."
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveDay}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-sm font-bold shadow-sm"
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>

                  {/* Offline Appointment */}
                  <div className="rounded-sm border border-[#0F766E]/20 bg-[#0F766E]/5 p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📅</span>
                      <p className="font-bold text-[#0F766E] text-sm">Add Offline Appointment</p>
                    </div>
                    <p className="text-xs text-slate-500">Schedule a walk-in or phone consultation not booked through NyayaSetu.</p>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">Client Name</Label>
                        <Input
                          placeholder="e.g. Ramesh Kumar"
                          value={newApptName}
                          onChange={e => setNewApptName(e.target.value)}
                          className="text-sm h-10 bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">Time</Label>
                        <Input
                          type="time"
                          value={newApptTime}
                          onChange={e => setNewApptTime(e.target.value)}
                          className="text-sm h-10 bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">Brief Description</Label>
                        <Input
                          placeholder="e.g. Property dispute consultation"
                          value={newApptDesc}
                          onChange={e => setNewApptDesc(e.target.value)}
                          className="text-sm h-10 bg-white border-slate-200"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddOfflineAppointment}
                      className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white h-10 rounded-sm font-bold shadow-sm"
                    >
                      + Add to Schedule
                    </Button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvocateDashboard;
