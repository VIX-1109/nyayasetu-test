import { supabase } from '@/lib/supabaseClient';
import { passwordSchema } from '@/lib/passwordPolicy';

const allowedSignupRoles = ['client', 'advocate'];

const getAuthRedirectUrl = (path) => {
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
};

const normalizeAuthError = (error) => {
  if (!error) return null;
  if (error.message?.toLowerCase().includes('email not confirmed')) {
    return new Error('Please verify your email before logging in.');
  }
  if (error.message?.toLowerCase().includes('invalid login credentials')) {
    return new Error('Invalid email or password.');
  }
  return error;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw normalizeAuthError(error);
  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    throw new Error('Please verify your email before opening your dashboard.');
  }
  return data.user;
};

export const signUp = async (email, password, name, role) => {
  const passwordResult = passwordSchema.safeParse(password);
  if (!passwordResult.success) {
    throw new Error(passwordResult.error.issues[0]?.message || 'Password is not strong enough');
  }

  const safeRole = allowedSignupRoles.includes(role) ? role : 'client';
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: safeRole },
      emailRedirectTo: getAuthRedirectUrl('/auth?confirmed=1')
    }
  });
  if (error) throw normalizeAuthError(error);
  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
};

export const fetchProfile = async (authUser) => {
  if (!authUser) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  let advocateDetails = null;
  if (data?.role === 'advocate') {
    const { data: advocateData } = await supabase
      .from('advocates')
      .select('verification_status, bar_council_number, specializations, experience_years, location, about, phone')
      .eq('id', authUser.id)
      .maybeSingle();
    advocateDetails = advocateData;
  }

  return data ? {
    ...authUser,
    ...data,
    email: authUser.email,
    email_confirmed_at: authUser.email_confirmed_at,
    advocate_details: advocateDetails,
    advocate_verification_status: advocateDetails?.verification_status || 'pending'
  } : authUser;
};

export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
};

export const requestPasswordReset = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirectUrl('/reset-password')
  });
  if (error) throw normalizeAuthError(error);
};

export const updatePassword = async (password) => {
  const passwordResult = passwordSchema.safeParse(password);
  if (!passwordResult.success) {
    throw new Error(passwordResult.error.issues[0]?.message || 'Password is not strong enough');
  }

  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw normalizeAuthError(error);
  return data.user;
};
