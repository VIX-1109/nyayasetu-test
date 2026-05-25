import { supabase } from '@/lib/supabaseClient';

const editableProfileFields = [
  'name',
  'phone',
  'city',
  'state',
  'language',
  'bio'
];

const filterProfileUpdates = (updates) => {
  return Object.fromEntries(
    Object.entries(updates).filter(([key]) => editableProfileFields.includes(key))
  );
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateOwnProfile = async (userId, updates) => {
  const safeUpdates = filterProfileUpdates(updates);
  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};
