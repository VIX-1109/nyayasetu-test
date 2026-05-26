import { supabase } from '@/lib/supabaseClient';

export const getMessages = async (userId, otherUserId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const getNewMessages = async (userId, otherUserId, afterTimestamp) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .gt('created_at', afterTimestamp)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

const postMessage = async ({ receiverId, content, adminNotice = false }) => {
  const response = await fetch('/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverId, content, adminNotice })
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to send message');
  }
  return payload.message;
};

export const sendMessage = async (_senderId, receiverId, content) => {
  return postMessage({ receiverId, content });
};

export const markMessagesAsRead = async (receiverId, senderId) => {
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', receiverId)
    .eq('sender_id', senderId)
    .eq('is_read', false);
};

export const sendAdminWarning = async (_adminId, userId, message) => {
  return postMessage({ receiverId: userId, content: message, adminNotice: true });
};
