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

export const sendMessage = async (senderId, receiverId, content) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, content })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const markMessagesAsRead = async (receiverId, senderId) => {
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', receiverId)
    .eq('sender_id', senderId)
    .eq('is_read', false);
};

export const sendAdminWarning = async (adminId, userId, message) => {
  const { error } = await supabase.from('messages').insert({
    sender_id: adminId,
    receiver_id: userId,
    content: `⚠️ ADMIN NOTICE: ${message}`
  });
  if (error) throw error;
};
