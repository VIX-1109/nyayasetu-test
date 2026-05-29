export const promoteUserToAdmin = async (supabase, userId) => {
  const { error } = await supabase.rpc('promote_user_to_admin', {
    p_user_id: userId,
  });

  if (error) throw error;
};
