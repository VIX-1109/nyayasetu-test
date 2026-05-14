import { supabase } from '@/lib/supabaseClient';

export const getAdvocates = async ({ specialization, location }) => {
  let query = supabase
    .from('advocates')
    .select('*, profiles!inner(name)')
    .eq('verification_status', 'verified');

  if (specialization && specialization !== 'all') {
    query = query.contains('specializations', [specialization]);
  }
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map(adv => ({ ...adv, name: adv.profiles.name }));
};

export const getAdvocateProfile = async (advocateId) => {
  const { data, error } = await supabase
    .from('advocates')
    .select('*')
    .eq('id', advocateId)
    .single();
  if (error) throw error;
  return data;
};

export const upsertAdvocateProfile = async (profileData) => {
  const { error } = await supabase.from('advocates').upsert(profileData);
  if (error) throw error;
};

export const getPendingAdvocates = async () => {
  const { data, error } = await supabase
    .from('advocates')
    .select('*, profiles!inner(name)')
    .eq('verification_status', 'pending');
  if (error) throw error;
  return data.map(adv => ({ ...adv, name: adv.profiles.name }));
};

export const updateVerificationStatus = async (advocateId, status) => {
  const updateData = status === 'verified'
    ? { admin_verified: true, bar_verified: true }
    : { admin_verified: false, bar_verified: false };

  const { error } = await supabase
    .from('advocates')
    .update(updateData)
    .eq('id', advocateId);
  if (error) throw error;
};
