"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AccountMenu from '@/components/AccountMenu';
import { useAdvocateDashboard } from '@/hooks/useAdvocateDashboard';
import { AlertCircle, BadgeCheck, Clock, Scale } from 'lucide-react';

const AdvocateVerification = ({ user, logout }) => {
  const [showForm, setShowForm] = useState(false);
  const {
    profile,
    loading,
    profileData,
    setProfileData,
    handleCreateProfile,
    calculateProfileCompletion,
    appointments,
    handleUpdateAppointmentStatus,
  } = useAdvocateDashboard(user);

  const pendingAppointments = appointments.filter((app) => app.status === 'pending');

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">Loading verification...</div>;
  }

  const status = profile?.verification_status || 'pending';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="serif text-2xl font-bold text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/feed" className="font-medium text-slate-700 hover:text-[#0F172A]">Justice Feed</Link>
            <Link href="/ai-learning" className="font-medium text-slate-700 hover:text-[#0F172A]">AI Learning</Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>

      <main className="ns-page">
        <div className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#B45309]">
                  {status === 'verified' ? <BadgeCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  <span className="text-sm font-bold uppercase tracking-wider">Advocate Verification</span>
                </div>
                <h1 className="serif text-4xl font-bold text-[#0F172A]">Verification Required</h1>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Full advocate dashboard access is unlocked only after NyayaSetu verifies your professional profile and Bar Council details.
                </p>
              </div>
              <div className={`rounded-sm border px-4 py-2 text-sm font-bold uppercase tracking-wider ${
                status === 'verified'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}>
                {status}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold text-[#0F172A]">{calculateProfileCompletion()}%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile completion</p>
              </div>
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold text-[#0F172A]">{profile?.bar_council_number ? 'Added' : 'Missing'}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Bar Council details</p>
              </div>
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold text-[#0F172A]">Admin</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Manual review</p>
              </div>
            </div>

            {status !== 'verified' && (
              <div className="mt-6 flex gap-3 rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  You can update verification details here. You will not appear as a verified advocate or access full advocate tools until admin approval.
                </p>
              </div>
            )}

            {pendingAppointments.length > 0 && (
              <div className="mt-6 rounded-sm border border-[#0F766E]/30 bg-emerald-50/50 p-5">
                <h2 className="serif text-xl font-semibold text-[#0F172A]">
                  New consultation requests ({pendingAppointments.length})
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Citizens can book you before verification. Accept or reject requests here; full scheduling tools unlock after admin approval.
                </p>
                <div className="mt-4 space-y-3">
                  {pendingAppointments.map((app) => (
                    <div key={app.id} className="rounded-sm border border-slate-200 bg-white p-4">
                      <p className="font-semibold text-[#0F172A]">{app.profiles?.name || 'Citizen'}</p>
                      <p className="text-xs text-slate-500">{app.date} at {app.time}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{app.description}</p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          onClick={() => handleUpdateAppointmentStatus(app.id, 'confirmed')}
                          className="h-9 rounded-sm bg-[#0F766E] px-4 text-white hover:bg-[#0F766E]/90"
                        >
                          Accept
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleUpdateAppointmentStatus(app.id, 'cancelled')}
                          className="h-9 rounded-sm"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === 'verified' ? (
              <Link href="/advocate/dashboard">
                <Button className="mt-8 h-12 rounded-sm bg-[#0F172A] px-8 font-bold text-white hover:bg-[#0F172A]/90">
                  Open Advocate Dashboard
                </Button>
              </Link>
            ) : (
              <Button onClick={() => setShowForm((value) => !value)} className="mt-8 h-12 rounded-sm bg-[#B45309] px-8 font-bold text-white hover:bg-[#B45309]/90">
                {showForm ? 'Hide Verification Form' : 'Update Verification Details'}
              </Button>
            )}
          </section>

          {showForm && (
            <section className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="serif mb-6 text-2xl font-semibold text-[#0F172A]">Professional Details</h2>
              <form onSubmit={handleCreateProfile} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bar_council_number">Bar Council Number</Label>
                    <Input id="bar_council_number" value={profileData.bar_council_number} onChange={(e) => setProfileData({ ...profileData, bar_council_number: e.target.value })} required className="h-11 rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} required className="h-11 rounded-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations</Label>
                  <Input id="specializations" value={profileData.specializations} onChange={(e) => setProfileData({ ...profileData, specializations: e.target.value })} required placeholder="Civil Litigation, Criminal Law, Family Law" className="h-11 rounded-sm" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input id="experience_years" type="number" value={profileData.experience_years} onChange={(e) => setProfileData({ ...profileData, experience_years: e.target.value })} required className="h-11 rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} required className="h-11 rounded-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">Professional Bio</Label>
                  <Textarea id="about" value={profileData.about} onChange={(e) => setProfileData({ ...profileData, about: e.target.value })} required rows={5} className="rounded-sm" />
                </div>
                <Button type="submit" className="h-12 rounded-sm bg-[#0F172A] px-8 font-bold text-white hover:bg-[#0F172A]/90">
                  Submit Details for Review
                </Button>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdvocateVerification;
