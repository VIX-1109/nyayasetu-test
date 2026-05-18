import { useState, useEffect } from 'react';
import { getAppointmentsByClient } from '@/services/appointmentService';
import { toast } from 'sonner';

export const useClientDashboard = (user) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedAdvocates] = useState([
    { id: 'demo-1', name: 'Adv. Meera Joshi', spec: 'Family Law', location: 'Pune' },
    { id: 'demo-2', name: 'Adv. Karan Singh', spec: 'Property Law', location: 'Delhi' }
  ]);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointmentsByClient(user.id);
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return { appointments, loading, savedAdvocates, getStatusColor };
};
