import { useState, useEffect } from 'react';
import { getAdvocateProfile, upsertAdvocateProfile } from '@/services/advocateService';
import { getAppointmentsByAdvocate, updateAppointmentStatus } from '@/services/appointmentService';
import { toast } from 'sonner';

export const useAdvocateDashboard = (user) => {
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

  const fetchProfile = async () => {
    try {
      const data = await getAdvocateProfile(user.id);
      setProfile(data);
      setProfileData({
        bar_council_number: data.bar_council_number || '',
        specializations: data.specializations?.join(', ') || '',
        experience_years: data.experience_years || '',
        location: data.location || '',
        about: data.about || '',
        phone: data.phone || ''
      });
    } catch (error) {
      if (error.code === 'PGRST116') {
        setShowProfileDialog(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await getAppointmentsByAdvocate(user.id);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments');
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      await upsertAdvocateProfile({
        id: user.id,
        ...profileData,
        specializations: profileData.specializations.split(',').map(s => s.trim()),
        experience_years: parseInt(profileData.experience_years)
      });
      toast.success('Profile updated successfully!');
      setShowProfileDialog(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
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

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  return {
    profile, appointments, loading,
    showProfileDialog, setShowProfileDialog,
    profileData, setProfileData,
    handleCreateProfile,
    handleUpdateAppointmentStatus,
    calculateProfileCompletion
  };
};
