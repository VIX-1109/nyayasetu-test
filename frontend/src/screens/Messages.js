import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, Send, ArrowLeft, User, Clock } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import AccountMenu from '@/components/AccountMenu';

const Messages = ({ user, logout, peerUserId }) => {
  const userId = peerUserId;
  const { messages, input, setInput, loading, messagesEndRef, handleSend } = useMessages(user, userId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <nav className="ns-nav sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <AccountMenu user={user} logout={logout} />
        </div>
      </nav>

      <div className="flex-1 ns-page py-6">
        <div className="max-w-3xl mx-auto h-full flex flex-col">

          {/* Chat container */}
          <div
            className="flex flex-col rounded-sm overflow-hidden shadow-lg border border-slate-200"
            style={{ height: '75vh', minHeight: '520px' }}
            data-testid="messages-container"
          >

            {/* Chat header */}
            <div
              className="flex items-center gap-4 px-6 py-4 border-b border-white/10"
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
            >
              <Link
                href={user?.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="w-10 h-10 rounded-full bg-[#B45309]/20 border border-[#B45309]/30 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-[#B45309]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold serif text-lg truncate">Consultation Chat</h2>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Refreshes every 4 seconds
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Live</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
              {loading ? (
                <div className="flex flex-col gap-3 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`h-12 rounded-sm ${i % 2 === 0 ? 'w-48 bg-slate-200' : 'w-36 bg-slate-300'}`} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-16" data-testid="no-messages">
                  <div className="bg-white border border-slate-200 p-4 rounded-full shadow-sm">
                    <Send className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="font-semibold serif text-slate-500">No messages yet</p>
                  <p className="text-slate-400 text-sm">Start the conversation below.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${msg.id}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${msg.sender_id === user.id ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`rounded-sm px-4 py-3 shadow-sm ${
                        msg.sender_id === user.id
                          ? 'bg-[#0F172A] text-white rounded-br-none'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 px-1">
                        {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSend} className="border-t border-slate-200 p-4 bg-white">
              <div className="flex gap-2">
                <Input
                  data-testid="message-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="h-12 bg-slate-50 border-slate-200 focus:border-[#0F172A] rounded-sm flex-1 transition-colors"
                />
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  data-testid="send-message-btn"
                  className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-5 rounded-sm shadow-sm disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                All messages are private between you and the other party.
              </p>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
