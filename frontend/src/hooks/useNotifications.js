import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getNotifications, markAsRead, markAllAsRead } from '@/services/notificationService';

export const useNotifications = (user) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const channelRef = useRef(null);
  // Unique per hook instance so desktop + mobile bells don't conflict
  const instanceId = useRef(Math.random().toString(36).slice(2));

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();

    if (channelRef.current) return;

    const notifChannel = supabase.channel(`notifications:${user.id}:${instanceId.current}`);
    channelRef.current = notifChannel;

    notifChannel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new, ...prev]);
        setUnreadCount((prev) => prev + 1);
      })
      .subscribe();

    // Cleanup on unmount or when user.id changes
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
};
