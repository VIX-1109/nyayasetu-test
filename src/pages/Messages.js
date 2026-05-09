import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, Send } from 'lucide-react';
import { toast } from 'sonner';

const Messages = ({ user, logout }) => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const lastTsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', userId)
        .eq('is_read', false);
    } catch (e) {
      // ignore
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data);
      if (data.length > 0) {
        lastTsRef.current = data[data.length - 1].created_at;
      }
      await markRead();
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const pollNewMessages = async () => {
    if (!lastTsRef.current) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .gt('created_at', lastTsRef.current)
        .order('created_at', { ascending: true });
        
      if (data && data.length > 0) {
        setMessages((prev) => [...prev, ...data]);
        lastTsRef.current = data[data.length - 1].created_at;
        await markRead();
      }
    } catch (e) {
      // ignore transient errors
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageContent = input;
    setInput('');

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          content: messageContent
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setMessages((prev) => [...prev, data]);
      lastTsRef.current = data.created_at;
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-slate-200 px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to={user.role === 'admin' ? '/admin' : user.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'}>
              <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm font-medium">
                Dashboard
              </Button>
            </Link>
            <Button onClick={logout} variant="ghost" className="text-slate-700">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden" style={{ height: '70vh' }} data-testid="messages-container">
            <div className="h-full flex flex-col">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-xl font-semibold serif text-[#0F172A]">Messages</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="text-center py-12">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-600" data-testid="no-messages">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`} data-testid={`message-${msg.id}`}>
                      <div className={`max-w-[70%] rounded-sm p-4 ${
                        msg.sender_id === user.id
                          ? 'bg-[#0F172A] text-white'
                          : 'bg-slate-100 text-slate-900 border border-slate-200'
                      }`}>
                        <p className="text-base leading-relaxed">{msg.content}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-slate-200 p-4">
                <div className="flex gap-2">
                  <Input
                    data-testid="message-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="h-12 bg-white border-slate-200 rounded-sm flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim()}
                    data-testid="send-message-btn"
                    className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-6 rounded-sm"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

