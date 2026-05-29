import { getAuthenticatedUser } from '../repositories/profile.repository.js';
import { sendMessage } from '../services/message.service.js';

export const sendMessageController = async (req, supabase) => {
  const payload = await req.json();
  const { user } = await getAuthenticatedUser(supabase);

  const message = await sendMessage(supabase, {
    senderId: user?.id,
    receiverId: payload.receiverId,
    content: payload.content,
    adminNotice: payload.adminNotice,
  });

  return {
    status: 201,
    body: { message },
  };
};
