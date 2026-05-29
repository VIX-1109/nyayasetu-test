import { getAuthenticatedUser } from '../repositories/profile.repository.js';
import { promoteAdminUser } from '../services/admin.service.js';

export const promoteAdminController = async (req, supabase) => {
  const payload = await req.json();
  const { user } = await getAuthenticatedUser(supabase);

  await promoteAdminUser(supabase, {
    actorId: user?.id,
    userId: payload.userId,
  });

  return {
    status: 200,
    body: { success: true },
  };
};
