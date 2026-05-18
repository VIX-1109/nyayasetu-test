import { supabase } from '@/lib/supabaseClient';

export const getAllUsers = async () => {
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (profilesError) throw profilesError;

  const { data: advocatesData, error: advError } = await supabase
    .from('advocates')
    .select('*');
  if (advError) throw advError;

  return profilesData.map(p => ({
    ...p,
    advocate_details: advocatesData.find(a => a.id === p.id) || null
  }));
};

export const updateUserProfile = async (userId, updates) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
};
