'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Calendar, MessageCircle, Shield, Heart, MessageSquare } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const iconMap = {
  appointment_confirmed: { icon: Calendar, color: 'text-emerald-600 bg-emerald-50' },
  appointment_cancelled: { icon: Calendar, color: 'text-red-600 bg-red-50' },
  new_message: { icon: MessageCircle, color: 'text-blue-600 bg-blue-50' },
  verification_approved: { icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
  verification_rejected: { icon: Shield, color: 'text-red-600 bg-red-50' },
  post_liked: { icon: Heart, color: 'text-pink-600 bg-pink-50' },
  post_commented: { icon: MessageSquare, color: 'text-[#B45309] bg-amber-50' },
};

const formatTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString('en-IN');
};

const NotificationBell = ({ user }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { notifications, unreadCount, loading, handleMarkAsRead, handleMarkAllAsRead } = useNotifications(user);

  const handleClick = async (notification) => {
    if (!notification.is_read) await handleMarkAsRead(notification.id);
    setOpen(false);
    if (notification.link) router.push(notification.link);
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-600 hover:text-[#0F172A] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 bg-white border border-slate-200 rounded-sm shadow-xl overflow-hidden">

          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between border-b border-slate-100"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-white" />
              <span className="text-white font-bold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white font-bold transition-colors"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-sm shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                        <div className="h-2.5 bg-slate-100 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="h-8 w-8 text-slate-200 mx-auto" />
                <p className="text-slate-400 text-sm font-medium">No notifications yet</p>
                <p className="text-slate-300 text-xs">We'll let you know when something happens</p>
              </div>
            ) : (
              notifications.map((n) => {
                const config = iconMap[n.type] || { icon: Bell, color: 'text-slate-600 bg-slate-100' };
                const Icon = config.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!n.is_read ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className={`p-2 rounded-sm shrink-0 ${config.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-[#0F172A] truncate">{n.title}</p>
                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{formatTime(n.created_at)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 text-center">
              <p className="text-[10px] text-slate-400">Showing last 20 notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
