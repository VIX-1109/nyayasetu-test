"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Scale, Calendar, CheckCircle2, Clock, Newspaper, Pen, User, BarChart3, MessageSquare, AlertCircle, Eye, TrendingUp, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Inbox } from '@/components/Inbox';
import { useAdvocateDashboard } from '@/hooks/useAdvocateDashboard';

const AdvocateDashboard = ({ user, logout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
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
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/feed" className="text-slate-700 hover:text-[#0F172A] font-medium">Justice Feed</Link>
            <Link href="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">AI Learning</Link>
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
                    <p className="text-xl font-bold serif text-[#0F766E]">{allAppointments.filter(a => a.status === 'confirmed').length}</p>
                    <p className="text-[10px] text-[#0F766E] uppercase font-bold tracking-tighter">Confirmed Consults</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-[#0F766E]/20" />
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
                <h3 className="text-lg font-semibold serif text-[#0F172A] mb-4">Profile Completion</h3>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B45309] transition-all duration-1000" style={{ width: `${calculateProfileCompletion()}%` }}></div>
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
                      allAppointments.map((app) => (
                        <div key={app.id} className="p-6 hover:bg-slate-50 transition-colors group">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-[#0F172A] text-lg">{app.profiles?.name || 'Citizen'}</h4>
                                {(() => {
                                  let displayStatus = app.status;
                                  if (app.date) {
                                    const apptDate = new Date(`${app.date}T${app.time || '00:00'}`);
                                    const now = new Date();
                                    if (app.status === 'completed' && apptDate > now) {
                                      displayStatus = 'confirmed';
                                    } else if (app.status === 'confirmed' && apptDate < now) {
                                      displayStatus = 'completed';
                                    }
                                  }
                                  return (
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                                      displayStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                      displayStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                      displayStatus === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                      'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}>
                                      {displayStatus}
                                    </span>
                                  );
                                })()}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {app.date}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {app.time}</span>
                              </div>
                              <p className="text-sm text-slate-600 max-w-xl line-clamp-2">{app.description}</p>
                            </div>
                            
                            {app.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <Button onClick={() => handleUpdateAppointmentStatus(app.id, 'confirmed')} className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 px-6 rounded-sm shadow-sm">
                                  Accept
                                </Button>
                                <Button onClick={() => handleUpdateAppointmentStatus(app.id, 'cancelled')} variant="outline" className="h-10 px-6 rounded-sm border-slate-200">
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
                <Input id="bar_council_number" value={profileData.bar_council_number} onChange={(e) => setProfileData({...profileData, bar_council_number: e.target.value})} required className="h-11 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} required className="h-11 rounded-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specializations">Specializations (comma separated)</Label>
              <Input id="specializations" value={profileData.specializations} onChange={(e) => setProfileData({...profileData, specializations: e.target.value})} required placeholder="Civil Litigation, Criminal Law, Family Law" className="h-11 rounded-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input id="experience_years" type="number" value={profileData.experience_years} onChange={(e) => setProfileData({...profileData, experience_years: e.target.value})} required className="h-11 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (City, State)</Label>
                <Input id="location" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} required className="h-11 rounded-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">Professional Bio / About</Label>
              <Textarea id="about" value={profileData.about} onChange={(e) => setProfileData({...profileData, about: e.target.value})} required rows={5} className="rounded-sm" placeholder="Describe your legal background, notable cases, and consultation approach..." />
            </div>
            <Button type="submit" className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-bold shadow-md">
              Update Profile Information
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={calendarModalOpen} onOpenChange={setCalendarModalOpen}>
        <DialogContent className="max-w-5xl rounded-sm p-0 overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row h-full">
            
            <div className="w-full md:w-1/2 p-8 border-r border-slate-100 bg-slate-50 flex flex-col items-center justify-start">
              <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-6 flex items-center self-start"><Calendar className="h-6 w-6 mr-3 text-[#0F766E]"/> Master Schedule</h2>
              <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200 w-full flex justify-center scale-110 origin-top mt-4 pb-8">
                  <CalendarUI
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
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
            </div>

            <div className="w-full md:w-1/2 p-8 bg-white overflow-y-auto max-h-[80vh]">
              <h3 className="serif text-xl font-bold text-[#0F172A] mb-6 border-b border-slate-100 pb-4">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
              </h3>
              
              {selectedDate && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-sm">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Block Date</p>
                      <p className="text-xs text-slate-500 mt-1">Prevent clients from booking consultations.</p>
                    </div>
                    <Button 
                      onClick={toggleBlockDay} 
                      variant={isSelectedBlocked ? "destructive" : "outline"}
                      size="sm"
                      className="shadow-sm"
                    >
                      {isSelectedBlocked ? "Unblock Date" : "Block Date"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="day_note" className="font-semibold text-slate-800">Private Note / Reminder</Label>
                    <Textarea 
                      id="day_note" 
                      value={currentNote} 
                      onChange={(e) => setCurrentNote(e.target.value)} 
                      rows={3} 
                      className="rounded-sm text-sm" 
                      placeholder="E.g., Court hearing at 10 AM, submit documents..." 
                    />
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleSaveDay} size="sm" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 rounded-sm shadow-sm">Save Note</Button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">Add Offline Appointment</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Client Name" value={newApptName} onChange={e => setNewApptName(e.target.value)} className="text-sm h-10" />
                      <Input type="time" value={newApptTime} onChange={e => setNewApptTime(e.target.value)} className="text-sm h-10" />
                    </div>
                    <Input placeholder="Brief Description" value={newApptDesc} onChange={e => setNewApptDesc(e.target.value)} className="text-sm h-10" />
                    <Button 
                      onClick={handleAddOfflineAppointment} 
                      className="w-full bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 rounded-sm font-medium shadow-sm"
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
