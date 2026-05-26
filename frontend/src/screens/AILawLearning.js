import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
const api = axios.create({ baseURL: `${backendUrl}/api` });
import { saveAiQuery } from '@/services/aiService';
import { consumeAiQuerySlot } from '@/lib/aiRateLimit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, Send, BookOpen, ChevronRight, FileText, CheckCircle2, Circle, Clock, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountMenu from '@/components/AccountMenu';

const getPrototypeLegalResponse = (question) => {
  const text = question.toLowerCase();
  let topic = 'general legal issue';
  let steps = [
    'Write down the facts in date order.',
    'Collect documents, messages, receipts, notices, IDs, and other proof.',
    'Avoid sharing sensitive personal details in public posts.',
    'Consult a verified advocate before taking formal legal action.'
  ];
  
  let simulation = {
    title: 'General Legal Process',
    phases: [
      { name: 'Fact Gathering', status: 'active', desc: 'Identify core facts and timeline.' },
      { name: 'Documentation', status: 'pending', desc: 'Secure all relevant physical and digital proof.' },
      { name: 'Legal Advice', status: 'pending', desc: 'Consult an advocate to understand specific laws.' },
      { name: 'Action', status: 'pending', desc: 'Send notice or file a complaint as advised.' }
    ],
    checklist: ['Statement of facts', 'Identity proof', 'Relevant correspondence']
  };

  if (text.includes('tenant') || text.includes('rent') || text.includes('landlord') || text.includes('deposit')) {
    topic = 'tenant or rental dispute';
    steps = [
      'Review your rent agreement and deposit clause.',
      'Collect rent receipts, handover proof, messages, and payment records.',
      'Send a clear written request before escalation.',
      'Speak with a property or civil advocate if the landlord still refuses.'
    ];
    simulation = {
      title: 'Rent Deposit Recovery Flow',
      phases: [
        { name: 'Agreement Review', status: 'active', desc: 'Check notice period and deposit clauses.' },
        { name: 'Proof Collection', status: 'pending', desc: 'Gather receipts and handover messages.' },
        { name: 'Formal Request', status: 'pending', desc: 'Send a written demand for the deposit.' },
        { name: 'Legal Notice', status: 'pending', desc: 'Advocate sends a formal notice if unpaid.' }
      ],
      checklist: ['Rent Agreement', 'Deposit Payment Proof', 'Rent Receipts', 'Handover Confirmation']
    };
  } else if (text.includes('fir') || text.includes('police') || text.includes('crime')) {
    topic = 'police or criminal-law process';
    steps = [
      'Write a clear timeline of what happened.',
      'Preserve evidence such as screenshots, call records, photos, and witnesses.',
      'For urgent danger, contact local police/emergency help immediately.',
      'Consult a criminal-law advocate for case-specific guidance.'
    ];
    simulation = {
      title: 'Criminal Incident Response',
      phases: [
        { name: 'Incident Record', status: 'active', desc: 'Note down exact time, location, and facts.' },
        { name: 'Evidence Preservation', status: 'pending', desc: 'Secure photos, videos, and witness names.' },
        { name: 'Police Reporting', status: 'pending', desc: 'Approach station or file online complaint/FIR.' },
        { name: 'Legal Counsel', status: 'pending', desc: 'Advocate reviews the FIR and evidence.' }
      ],
      checklist: ['Chronology of events', 'Evidence (Photos/Digital)', 'Witness contacts', 'Copy of FIR (if filed)']
    };
  } else if (text.includes('consumer') || text.includes('refund') || text.includes('product') || text.includes('service')) {
    topic = 'consumer complaint';
    steps = [
      'Keep invoices, order IDs, screenshots, delivery proof, and complaint tickets.',
      'Raise a written complaint with the business first.',
      'Note dates and responses carefully.',
      'Consult an advocate if the amount or harm is significant.'
    ];
    simulation = {
      title: 'Consumer Grievance Lifecycle',
      phases: [
        { name: 'Invoicing', status: 'active', desc: 'Ensure you have valid tax invoice and order ID.' },
        { name: 'Grievance Redressal', status: 'pending', desc: 'Contact official support and save ticket ID.' },
        { name: 'Pre-litigation', status: 'pending', desc: 'Send a formal email/letter to the company.' },
        { name: 'Consumer Commission', status: 'pending', desc: 'File a case via E-Daakhil if unresolved.' }
      ],
      checklist: ['Tax Invoice', 'Order Confirmation', 'Service Tickets', 'Correspondence Screenshots']
    };
  }

  return {
    content: `This looks like a ${topic}.\n\nGeneral information:\n${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nThis is general legal information, not legal advice. For your exact facts, documents, location, and deadlines, please consult a qualified advocate.`,
    simulation
  };
};

const AILawLearning = ({ user, logout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
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

    try {
      const { remaining } = consumeAiQuerySlot(user.id);
      if (remaining <= 3) {
        toast.info(`${remaining} AI questions left this hour`);
      }
    } catch (error) {
      toast.error(error.message);
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      if (backendUrl) {
        const response = await api.post('/ai/chat', {
          message: userMessage,
          session_id: sessionId
        });
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        if (!sessionId) {
          setSessionId(response.data.session_id);
        }
      } else {
        const result = getPrototypeLegalResponse(userMessage);
        setMessages(prev => [...prev, { role: 'assistant', content: result.content, analysis: result.simulation }]);
        if (user) {
          try {
            await saveAiQuery(user.id, userMessage, result.content);
          } catch (historyError) {
            console.error('Failed to save AI query history:', historyError);
          }
        }
      }
    } catch (error) {
      const result = getPrototypeLegalResponse(userMessage);
      toast.error('Live AI backend unavailable, showing prototype guidance');
      setMessages(prev => [...prev, { role: 'assistant', content: result.content, analysis: result.simulation }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">
              Find Advocates
            </Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>

      <div className="ns-page">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chat Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-[#B45309]" strokeWidth={1.5} />
              <h1 className="text-3xl font-semibold serif text-[#0F172A]">AI Law Learning</h1>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col h-[68vh] min-h-[520px] lg:h-[70vh]">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="bg-slate-50 inline-block p-4 rounded-full mb-2">
                      <Scale className="h-12 w-12 text-slate-400" />
                    </div>
                    <p className="text-xl text-slate-600 serif">How can I help you understand Indian law today?</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-4">
                      {['Tenant rights', 'Police complaint', 'Consumer refund', 'Property law'].map(q => (
                        <button 
                          key={q} 
                          onClick={() => setInput(`Tell me about ${q} process in India`)}
                          className="bg-white border border-slate-200 px-4 py-2 text-sm rounded-sm hover:border-[#B45309] hover:text-[#B45309] transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[92%] sm:max-w-[85%] space-y-3 ${msg.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`rounded-sm p-4 ${
                          msg.role === 'user' 
                            ? 'bg-[#0F172A] text-white shadow-md' 
                            : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                        }`}>
                          <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === 'assistant' && msg.analysis && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setAnalysisResult(msg.analysis)}
                            className="bg-white border-[#B45309] text-[#B45309] hover:bg-[#B45309]/5 font-medium"
                          >
                            <ChevronRight className="h-4 w-4 mr-1" /> Analyze Case Flow
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-sm p-4 animate-pulse">
                      <p className="text-slate-500">Processing legal inquiry...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your situation or ask a legal question..."
                    disabled={loading || !user}
                    className="h-12 bg-white border-slate-300 rounded-sm flex-1 focus:ring-1 focus:ring-[#B45309]"
                  />
                  <Button 
                    type="submit" 
                    disabled={loading || !user || !input.trim()}
                    className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-6 rounded-sm shadow-md"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                {!user && (
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Please <Link href="/auth" className="text-[#B45309] font-medium hover:underline">login</Link> to use the AI legal assistant
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Analysis Sidebar Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              {analysisResult ? (
                <div className="bg-white border border-slate-200 rounded-sm shadow-md overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-[#0F172A] p-5 text-white flex items-center justify-between">
                    <h2 className="text-xl font-semibold serif">{analysisResult.title}</h2>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setAnalysisResult(null)}>
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </Button>
                  </div>
                  
                  <Tabs defaultValue="simulator" className="p-0">
                    <TabsList className="w-full rounded-none border-b border-slate-100 bg-slate-50">
                      <TabsTrigger value="simulator" className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#B45309]">Simulator</TabsTrigger>
                      <TabsTrigger value="checklist" className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#B45309]">Checklist</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="simulator" className="p-6 focus-visible:ring-0">
                      <div className="space-y-8">
                        {analysisResult.phases.map((phase, i) => (
                          <div key={i} className="relative pl-8 pb-1 last:pb-0">
                            {i !== analysisResult.phases.length - 1 && (
                              <div className="absolute left-[11px] top-[24px] bottom-0 w-[2px] bg-slate-200"></div>
                            )}
                            <div className="absolute left-0 top-[2px]">
                              {phase.status === 'active' ? (
                                <div className="bg-[#B45309] rounded-full p-1 shadow-[0_0_0_4px_rgba(180,83,9,0.1)]">
                                  <Clock className="h-4 w-4 text-white animate-spin-slow" />
                                </div>
                              ) : phase.status === 'completed' ? (
                                <div className="bg-emerald-600 rounded-full p-1">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              ) : (
                                <div className="bg-slate-200 rounded-full p-1">
                                  <Circle className="h-4 w-4 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <h3 className={`font-semibold serif ${phase.status === 'active' ? 'text-[#B45309]' : 'text-[#0F172A]'}`}>
                              {phase.name}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{phase.desc}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <Link href="/advocates">
                          <Button className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-medium">
                            Consult verified advocate
                          </Button>
                        </Link>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="checklist" className="p-6 focus-visible:ring-0">
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-sm flex gap-3">
                          <Info className="h-5 w-5 text-[#B45309] shrink-0" />
                          <p className="text-xs text-amber-900">Ensure all documents are original or verified copies. Digital proof should include timestamps and clear sender/receiver details.</p>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                          {analysisResult.checklist.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-sm hover:bg-slate-50 transition-colors group">
                              <div className="h-5 w-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-[#B45309]">
                                <CheckCircle2 className="h-3 w-3 text-transparent group-hover:text-[#B45309]/30" />
                              </div>
                              <span className="text-sm text-slate-700 font-medium">{item}</span>
                              <FileText className="h-4 w-4 text-slate-300 ml-auto" />
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" className="w-full h-11 border-dashed border-slate-300 text-slate-500 hover:text-[#0F172A] hover:border-[#0F172A] mt-6">
                          Download PDF Checklist
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-sm p-8 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
                  <div className="bg-white p-4 rounded-full shadow-sm">
                    <Clock className="h-8 w-8 text-slate-300" />
                  </div>
                  <h2 className="text-lg font-semibold serif text-slate-500">Case Analysis Pending</h2>
                  <p className="text-sm text-slate-400 max-w-xs">Ask a specific legal question to unlock visual simulation and document checklists.</p>
                </div>
              )}

              <div className="bg-[#B45309]/5 border border-[#B45309]/20 rounded-sm p-6 space-y-4">
                <h2 className="font-semibold serif text-[#B45309]">NyayaSetu Guarantee</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#B45309] shrink-0 mt-1" />
                    <p className="text-xs text-slate-700 font-medium">All AI information is sourced from standard legal procedures in India.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#B45309] shrink-0 mt-1" />
                    <p className="text-xs text-slate-700 font-medium">Your chat history is encrypted and private.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILawLearning;
