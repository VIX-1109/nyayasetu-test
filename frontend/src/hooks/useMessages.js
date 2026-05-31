"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getMessages, sendMessage, markMessagesAsRead } from '@/services/messageService';
import { toast } from 'sonner';

export const useMessages = (user, userId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const data = await getMessages(user.id, userId);
      setMessages(data);
      await markMessagesAsRead(user.id, userId);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input;
    setInput('');
    try {
      await sendMessage(user.id, userId, content);
      // No need to manually append — Realtime subscription will pick it up
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  useEffect(() => {
    if (!user?.id || !userId) return;

    setLoading(true);
    setMessages([]);
    fetchMessages();

    // Supabase Realtime subscription — replaces 4s polling
    const channel = supabase
      .channel(`messages:${user.id}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const newMsg = payload.new;
          // Only add if it's from the person we're chatting with
          if (newMsg.sender_id === userId) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.find((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            await markMessagesAsRead(user.id, userId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return { messages, input, setInput, loading, messagesEndRef, handleSend };
};
