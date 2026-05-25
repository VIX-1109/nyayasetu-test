import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, Send } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import AccountMenu from '@/components/AccountMenu';

const Messages = ({ user, logout, peerUserId }) => {
  const userId = peerUserId;
  const { messages, input, setInput, loading, messagesEndRef, handleSend } = useMessages(user, userId);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <AccountMenu user={user} logout={logout} />
        </div>
      </nav>

      <div className="ns-page">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden h-[68vh] min-h-[500px] lg:h-[70vh]" data-testid="messages-container">
            <div className="h-full flex flex-col">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-xl font-semibold serif text-[#0F172A]">Messages</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {loading ? (
                  <div className="text-center py-12">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-600" data-testid="no-messages">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`} data-testid={`message-${msg.id}`}>
                      <div className={`max-w-[88%] sm:max-w-[70%] rounded-sm p-3 sm:p-4 ${msg.sender_id === user.id ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-900 border border-slate-200'}`}>
                        <p className="text-base leading-relaxed">{msg.content}</p>
                        <p className="text-xs mt-2 opacity-70">{new Date(msg.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-slate-200 p-4">
                <div className="flex gap-2">
                  <Input data-testid="message-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="h-12 bg-white border-slate-200 rounded-sm flex-1" />
                  <Button type="submit" disabled={!input.trim()} data-testid="send-message-btn" className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-6 rounded-sm">
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
