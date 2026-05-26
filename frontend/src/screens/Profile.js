"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { updateOwnProfile } from '@/services/profileService';
import { removeProfileAvatar, uploadProfileAvatar } from '@/services/avatarService';
import { validateAvatarSourceFile } from '@/lib/avatar';
import AvatarCropDialog from '@/components/AvatarCropDialog';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AccountMenu from '@/components/AccountMenu';
import { getDashboardPath } from '@/components/ProtectedPage';
import { BadgeCheck, Camera, Lock, Scale, Trash2, UserRound } from 'lucide-react';
import { toast } from 'sonner';

const safeValue = (value) => value || '';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    language: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => () => {
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
    }
  }, [cropImageSrc]);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: safeValue(user.name),
      phone: safeValue(user.phone || user.advocate_details?.phone),
      city: safeValue(user.city),
      state: safeValue(user.state),
      language: safeValue(user.language),
      bio: safeValue(user.bio)
    });
  }, [user]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const clearCropPreview = () => {
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
    }
    setCropImageSrc(null);
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !user) return;

    try {
      validateAvatarSourceFile(file);
      clearCropPreview();
      setCropImageSrc(URL.createObjectURL(file));
      setCropDialogOpen(true);
    } catch (error) {
      toast.error(error.message || 'Invalid image file');
    }
  };

  const handleCropConfirm = async (croppedFile) => {
    if (!user) return;

    setAvatarUploading(true);
    try {
      await uploadProfileAvatar(user.id, croppedFile);
      await refreshUser();
      toast.success('Profile picture updated');
      setCropDialogOpen(false);
      clearCropPreview();
    } catch (error) {
      toast.error(error.message || 'Unable to upload profile picture');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCropDialogChange = (open) => {
    if (!open && !avatarUploading) {
      clearCropPreview();
    }
    setCropDialogOpen(open);
  };

  const handleRemoveAvatar = async () => {
    if (!user?.avatar_url) return;

    setAvatarUploading(true);
    try {
      await removeProfileAvatar(user.id);
      await refreshUser();
      toast.success('Profile picture removed');
    } catch (error) {
      toast.error(error.message || 'Unable to remove profile picture');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateOwnProfile(user.id, form);
      await refreshUser();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="serif text-2xl font-bold text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/advocates" className="font-medium text-slate-700 hover:text-[#0F172A]">Find Advocates</Link>
            <Link href="/feed" className="font-medium text-slate-700 hover:text-[#0F172A]">Justice Feed</Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>

      <main className="ns-page">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <section className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-4">
                <UserAvatar user={user} size="lg" />
                <div className="min-w-0">
                  <h1 className="serif truncate text-2xl font-semibold text-[#0F172A]">{user.name || 'NyayaSetu Member'}</h1>
                  <p className="truncate text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-slate-500">Role</span>
                  <span className="font-semibold capitalize text-[#0F172A]">{user.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className={user.email_confirmed_at ? 'font-semibold text-emerald-700' : 'font-semibold text-amber-700'}>
                    {user.email_confirmed_at ? 'Verified' : 'Pending'}
                  </span>
                </div>
                {user.role === 'advocate' && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Advocate status</span>
                    <span className="font-semibold capitalize text-[#B45309]">{user.advocate_verification_status || 'pending'}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Joined</span>
                  <span className="font-semibold text-[#0F172A]">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</span>
                </div>
              </div>

              <Link href={getDashboardPath(user.role)}>
                <Button className="mt-6 h-11 w-full rounded-sm bg-[#0F172A] text-white hover:bg-[#0F172A]/90">
                  Open Dashboard
                </Button>
              </Link>
            </section>
          </aside>

          <section className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[#B45309]">
                    <UserRound className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Account</span>
                  </div>
                  <h2 className="serif text-3xl font-semibold text-[#0F172A]">My Profile</h2>
                  <p className="mt-2 text-sm text-slate-600">Edit public-safe account details. Sensitive role and verification fields are locked.</p>
                </div>
                <BadgeCheck className="hidden h-8 w-8 text-emerald-700 md:block" />
              </div>

              <div className="mb-8 rounded-sm border border-slate-200 bg-slate-50 p-5">
                <Label className="mb-3 block text-sm font-semibold text-[#0F172A]">Profile picture</Label>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <UserAvatar user={user} size="xl" />
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      Upload a clear photo (JPG, PNG, or WebP). You can crop and zoom before saving. Visible on your account menu and profile.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarSelect}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={avatarUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 rounded-sm border-slate-200"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {avatarUploading ? 'Uploading...' : user.avatar_url ? 'Change photo' : 'Upload photo'}
                      </Button>
                      {user.avatar_url && (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={avatarUploading}
                          onClick={handleRemoveAvatar}
                          className="h-10 rounded-sm border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input id="profile-name" value={form.name} onChange={(event) => handleChange('name', event.target.value)} className="h-11 rounded-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Phone</Label>
                  <Input id="profile-phone" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} className="h-11 rounded-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-city">City</Label>
                  <Input id="profile-city" value={form.city} onChange={(event) => handleChange('city', event.target.value)} className="h-11 rounded-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-state">State</Label>
                  <Input id="profile-state" value={form.state} onChange={(event) => handleChange('state', event.target.value)} className="h-11 rounded-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-language">Preferred Language</Label>
                  <Input id="profile-language" value={form.language} onChange={(event) => handleChange('language', event.target.value)} placeholder="English, Hindi, Marathi" className="h-11 rounded-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <Textarea id="profile-bio" value={form.bio} onChange={(event) => handleChange('bio', event.target.value)} rows={5} className="rounded-sm" />
                </div>
              </div>

              <div className="mt-8 rounded-sm border border-slate-200 bg-slate-50 p-4">
                <div className="flex gap-3">
                  <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <p className="text-sm text-slate-600">
                    Locked fields: role, email verification, admin permissions, and advocate verification status. These can only be changed by platform admin/database rules.
                  </p>
                </div>
              </div>

              <Button type="submit" disabled={saving} className="mt-8 h-12 rounded-sm bg-[#B45309] px-8 font-bold text-white hover:bg-[#B45309]/90">
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </section>
        </div>
      </main>

      <AvatarCropDialog
        open={cropDialogOpen}
        imageSrc={cropImageSrc}
        onOpenChange={handleCropDialogChange}
        onConfirm={handleCropConfirm}
        confirming={avatarUploading}
      />
    </div>
  );
};

export default Profile;
