import { supabase } from '@/lib/supabaseClient';

export const getAppointmentsByClient = async (clientId) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, advocates(profiles(name))')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAppointmentsByAdvocate = async (advocateId) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, profiles(name)')
    .eq('advocate_id', advocateId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);
  if (error) throw error;
};
