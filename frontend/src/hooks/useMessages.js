"use client";

import { useState, useEffect, useRef } from 'react';
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
      const sent = await sendMessage(user.id, userId, content);
      if (sent) setMessages(prev => [...prev, sent]);
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  useEffect(() => {
    if (!user?.id || !userId) return;

    setLoading(true);
    setMessages([]);
    fetchMessages();

    // Poll every 3 seconds for new messages
    const interval = setInterval(async () => {
      try {
        const data = await getMessages(user.id, userId);
        setMessages(prev => {
          // Only update if there are new messages to avoid unnecessary re-renders
          if (data.length !== prev.length) return data;
          return prev;
        });
      } catch (_) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [userId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return { messages, input, setInput, loading, messagesEndRef, handleSend };
};
