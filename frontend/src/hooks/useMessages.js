import { useState, useEffect, useRef } from 'react';
import { getMessages, getNewMessages, sendMessage, markMessagesAsRead } from '@/services/messageService';
import { toast } from 'sonner';

export const useMessages = (user, userId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const lastTsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const data = await getMessages(user.id, userId);
      setMessages(data);
      if (data.length > 0) lastTsRef.current = data[data.length - 1].created_at;
      await markMessagesAsRead(user.id, userId);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const pollNewMessages = async () => {
    if (!lastTsRef.current) return;
    try {
      const data = await getNewMessages(user.id, userId, lastTsRef.current);
      if (data && data.length > 0) {
        setMessages(prev => [...prev, ...data]);
        lastTsRef.current = data[data.length - 1].created_at;
        await markMessagesAsRead(user.id, userId);
      }
    } catch (e) {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input;
    setInput('');
    try {
      const data = await sendMessage(user.id, userId, content);
      setMessages(prev => [...prev, data]);
      lastTsRef.current = data.created_at;
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  useEffect(() => {
    setLoading(true);
    lastTsRef.current = null;
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    const id = setInterval(pollNewMessages, 4000);
    return () => clearInterval(id);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return { messages, input, setInput, loading, messagesEndRef, handleSend };
};
