import { supabase } from '@/lib/supabaseClient';

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const signUp = async (email, password, name, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } }
  });
  if (error) throw error;
  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const fetchProfile = async (authUser) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();
  return data ? { ...authUser, ...data } : authUser;
};

export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
};
