import { promoteUserToAdmin } from '../repositories/admin.repository.js';

export const promoteAdminUser = async (supabase, { actorId, userId }) => {
  if (!actorId) {
    const error = new Error('Authentication required');
    error.status = 401;
    throw error;
  }

  if (!userId) {
    const error = new Error('userId required');
    error.status = 400;
    throw error;
  }

  await promoteUserToAdmin(supabase, userId);
};
