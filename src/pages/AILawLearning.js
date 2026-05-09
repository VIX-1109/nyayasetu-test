import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const api = axios.create({ baseURL: `${process.env.REACT_APP_BACKEND_URL}/api` });
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, Send, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const AILawLearning = ({ user, logout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user) {
      toast.error('Please login to use AI Law Learning');
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMessage,
        session_id: sessionId
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
      if (!sessionId) {
        setSessionId(response.data.session_id);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to get response');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
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
          <div className="flex items-center gap-6">
            <Link to="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Find Advocates
            </Link>
            {user ? (
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
            ) : (
              <Link to="/auth">
                <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm font-medium">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="relative" style={{ 
        backgroundImage: 'url(https://images.unsplash.com/photo-1619771678310-9f1e06085d86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxsYXclMjBsaWJyYXJ5JTIwYm9va3MlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcwODIyODUxfDA&ixlib=rb-4.1.0&q=85)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative px-6 md:px-12 lg:px-24 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <BookOpen className="h-10 w-10 text-[#B45309]" strokeWidth={1.5} />
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight serif text-white" data-testid="ai-learning-title">
                AI Law Learning
              </h1>
            </div>
            <p className="text-lg text-slate-300 text-center mb-8">
              Learn about Indian laws, legal procedures, and your rights through intelligent AI conversations.
            </p>

            <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(15,23,42,0.08)] overflow-hidden" style={{ height: '60vh' }} data-testid="chat-container">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-600" data-testid="welcome-message">Ask me anything about Indian laws, legal rights, or procedures.</p>
                      <p className="text-sm text-slate-500 mt-2">Example: "What is Section 302 of IPC?" or "How to file an FIR?"</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} data-testid={`message-${msg.role}-${idx}`}>
                        <div className={`max-w-[80%] rounded-sm p-4 ${
                          msg.role === 'user' 
                            ? 'bg-[#0F172A] text-white' 
                            : 'bg-slate-100 text-slate-900 border border-slate-200'
                        }`}>
                          <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex justify-start" data-testid="loading-indicator">
                      <div className="bg-slate-100 border border-slate-200 rounded-sm p-4">
                        <p className="text-slate-600">Thinking...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="border-t border-slate-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      data-testid="chat-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about Indian laws..."
                      disabled={loading || !user}
                      className="h-12 bg-white border-slate-200 rounded-sm flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={loading || !user || !input.trim()}
                      data-testid="send-btn"
                      className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-6 rounded-sm"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-sm text-slate-600 mt-2 text-center" data-testid="login-prompt">
                      Please <Link to="/auth" className="text-[#B45309] font-medium hover:underline">login</Link> to use AI Law Learning
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-400">
              <p>Disclaimer: This AI provides general legal information. For specific legal advice, consult a qualified advocate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILawLearning;


