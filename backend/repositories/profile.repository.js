export const getAuthenticatedUser = async (supabase) => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return { user: null, error };
  }

  return { user: data.user, error: null };
};

export const findProfileRoleById = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data?.role;
};
