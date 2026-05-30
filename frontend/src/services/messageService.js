"use client";
import { supabase } from '@/lib/supabaseClient';

/**
 * Retrieve all messages between two users, ordered by creation time.
 */
export const getMessages = async (userId, otherUserId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Retrieve new messages for a conversation after a given timestamp.
 */
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

// Helper for sending a message via the API endpoint.
const postMessage = async ({ receiverId, content, adminNotice = false }) => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const response = await fetch(`${apiBase}/api/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverId, content, adminNotice })
  }).catch(err => {
    console.error('Fetch error in sendMessage:', err);
    throw err;
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to send message');
  }
  return payload.message;
};

/** Send a message from a user to a receiver. */
export const sendMessage = async (_senderId, receiverId, content) => {
  // The backend determines the sender based on authentication; senderId param is unused.
  return postMessage({ receiverId, content });
};

/** Mark messages as read for a conversation. */
export const markMessagesAsRead = async (receiverId, senderId) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', receiverId)
    .eq('sender_id', senderId)
    .eq('is_read', false);

  if (error) throw error;
};

/** Send an admin warning message to a user. */
export const sendAdminWarning = async (_adminId, userId, message) => {
  return postMessage({ receiverId: userId, content: message, adminNotice: true });
};
