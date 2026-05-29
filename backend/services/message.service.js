import { createMessage } from '../repositories/message.repository.js';
import { findProfileRoleById } from '../repositories/profile.repository.js';

export const sendMessage = async (supabase, { senderId, receiverId, content, adminNotice = false }) => {
  const trimmedContent = content?.trim();

  if (!senderId) {
    const error = new Error('Authentication required');
    error.status = 401;
    throw error;
  }

  if (!receiverId || !trimmedContent) {
    const error = new Error('receiverId and content required');
    error.status = 400;
    throw error;
  }

  if (adminNotice) {
    const role = await findProfileRoleById(supabase, senderId);
    if (role !== 'admin') {
      const error = new Error('Admin access required');
      error.status = 403;
      throw error;
    }
  }

  return createMessage(supabase, {
    sender_id: senderId,
    receiver_id: receiverId,
    content: adminNotice ? `ADMIN NOTICE: ${trimmedContent}` : trimmedContent,
  });
};
