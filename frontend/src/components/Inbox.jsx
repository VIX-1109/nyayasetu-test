import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { MessageCircle } from 'lucide-react';

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString();
};

export const Inbox = ({ emptyHint }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const { data: userResponse } = await supabase.auth.getUser();
      const user = userResponse?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`*, sender:profiles!messages_sender_id_fkey(name, role), receiver:profiles!messages_receiver_id_fkey(name, role)`)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const convos = {};
      data.forEach(msg => {
        const isSender = msg.sender_id === user.id;
        const otherUser = isSender ? msg.receiver : msg.sender;
        const otherUserId = isSender ? msg.receiver_id : msg.sender_id;
        
        if (!convos[otherUserId]) {
          convos[otherUserId] = {
            user_id: otherUserId,
            name: otherUser?.name || 'Unknown',
            role: otherUser?.role || '',
            last_message: msg.content,
            last_at: msg.created_at,
            unread_count: 0
          };
        }
        if (msg.receiver_id === user.id && !msg.is_read) {
          convos[otherUserId].unread_count += 1;
        }
      });

      setConversations(Object.values(convos));
    } catch (e) {
      // silently ignore - keep dashboard rendering
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const id = setInterval(fetchConversations, 8000);
    return () => clearInterval(id);
  }, []);

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8" data-testid="inbox-section">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold serif text-[#0F172A]">Inbox</h2>
          {totalUnread > 0 && (
            <span
              className="bg-[#B45309] text-white text-xs font-bold px-2 py-0.5 rounded-full"
              data-testid="inbox-unread-badge"
            >
              {totalUnread} new
            </span>
          )}
        </div>
        <MessageCircle className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-8 text-slate-600" data-testid="inbox-empty">
          {emptyHint || 'No conversations yet.'}
        </div>
      ) : (
        <div className="divide-y divide-slate-100" data-testid="inbox-list">
          {conversations.map((c) => (
            <Link
              key={c.user_id}
              href={`/messages/${c.user_id}`}
              className="block py-4 px-2 hover:bg-slate-50 transition-colors -mx-2 rounded-sm"
              data-testid={`inbox-item-${c.user_id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#0F172A] truncate">{c.name}</span>
                    {c.role && (
                      <span className="text-xs uppercase tracking-wider text-slate-500">{c.role}</span>
                    )}
                    {c.unread_count > 0 && (
                      <span
                        className="ml-auto md:ml-0 bg-[#0F766E] text-white text-xs font-bold px-2 py-0.5 rounded-full"
                        data-testid={`inbox-unread-${c.user_id}`}
                      >
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 truncate">{c.last_message}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap pt-1">
                  {formatTime(c.last_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;
