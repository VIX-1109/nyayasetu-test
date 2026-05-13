import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, BadgeCheck, BookOpen, Flag, Heart, MessageCircle, Newspaper, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const demoPosts = [
  {
    id: 'demo-tenant-rights',
    author_name: 'Adv. Meera Joshi',
    author_role: 'advocate',
    verified: true,
    type: 'Legal Awareness',
    category: 'Tenant Rights',
    content: 'If a landlord refuses to return a security deposit, first collect rent receipts, messages, agreement copies, and handover proof. A written notice often becomes the first practical step before escalation.',
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    reactions: 28,
    comments: 6
  },
  {
    id: 'demo-consumer',
    author_name: 'NyayaSetu Legal Desk',
    author_role: 'admin',
    verified: true,
    type: 'News Explainer',
    category: 'Consumer Rights',
    content: 'Consumer complaints are strongest when the user keeps invoice proof, screenshots, service tickets, delivery records, and clear chronology. The platform should help users structure this before speaking to an advocate.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    reactions: 41,
    comments: 11
  },
  {
    id: 'demo-help',
    author_name: 'Aarav Sharma',
    author_role: 'client',
    verified: false,
    type: 'Help Request',
    category: 'Property Law',
    content: 'Need guidance on what documents are usually checked before buying a resale flat in Pune. Looking for general awareness first, then may consult a property advocate.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    reactions: 12,
    comments: 4
  }
];

const categories = ['Tenant Rights', 'Consumer Rights', 'Property Law', 'Family Law', 'Employment', 'Criminal Law', 'Women Safety', 'RTI'];

const formatTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
};

const JusticeFeed = ({ user, logout }) => {
  const [posts, setPosts] = useState(demoPosts);
  const [content, setContent] = useState('');
  const [type, setType] = useState('Legal Awareness');
  const [category, setCategory] = useState('Tenant Rights');
  const [loading, setLoading] = useState(true);

  const canPost = Boolean(user);

  useEffect(() => {
    fetchPosts();
  }, []);

  const feedStats = useMemo(() => ({
    posts: posts.length,
    verifiedVoices: posts.filter((p) => p.verified).length,
    helpRequests: posts.filter((p) => p.type === 'Help Request').length
  }), [posts]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(name, role)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data?.length) {
        setPosts(data.map((post) => ({
          id: post.id,
          author_name: post.profiles?.name || 'NyayaSetu Member',
          author_role: post.profiles?.role || 'member',
          verified: post.author_verified || post.profiles?.role === 'admin',
          type: post.type || 'Legal Awareness',
          category: post.category || 'General',
          content: post.content,
          created_at: post.created_at,
          reactions: post.reactions_count || 0,
          comments: post.comments_count || 0
        })));
      }
    } catch (error) {
      // The prototype can run before the posts table exists.
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      toast.error('Please login to publish on the justice feed');
      return;
    }

    const newPost = {
      id: `local-${Date.now()}`,
      author_name: user.name || user.email,
      author_role: user.role,
      verified: user.role === 'admin' || user.role === 'advocate',
      type,
      category,
      content: content.trim(),
      created_at: new Date().toISOString(),
      reactions: 0,
      comments: 0
    };

    setPosts((prev) => [newPost, ...prev]);
    setContent('');
    toast.success('Post added to the prototype feed');

    try {
      await supabase.from('posts').insert({
        author_id: user.id,
        type,
        category,
        content: newPost.content,
        status: 'published',
        author_verified: newPost.verified
      });
    } catch (error) {
      // Local optimistic post keeps the prototype usable without a posts table.
    }
  };

  const handleReport = async (post) => {
    toast.success('Report captured for admin review in the prototype');
    try {
      if (user) {
        await supabase.from('post_reports').insert({
          post_id: post.id,
          reporter_id: user.id,
          reason: 'needs_review',
          status: 'open'
        });
      }
    } catch (error) {
      // Reporting still demonstrates the moderation flow in the prototype.
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link to="/advocates" className="text-slate-700 hover:text-[#0F172A] font-medium">Find Advocates</Link>
            <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">AI Learning</Link>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'}>
                  <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm font-medium">Dashboard</Button>
                </Link>
                <Button onClick={logout} variant="ghost" className="text-slate-700">Logout</Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm font-medium">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="ns-page">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="ns-heading-xl mb-3">Justice Feed</h1>
              <p className="text-slate-600 leading-relaxed">
                A professional feed for legal awareness, justice news, advocate insights, and safe help-seeking.
              </p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-5">
              <h2 className="font-semibold serif text-xl text-[#0F172A] mb-4">Prototype Signals</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Posts</span><span className="font-semibold">{feedStats.posts}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Verified voices</span><span className="font-semibold">{feedStats.verifiedVoices}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Help requests</span><span className="font-semibold">{feedStats.helpRequests}</span></div>
              </div>
            </div>

            <div className="bg-[#0F172A] text-white rounded-sm p-5">
              <ShieldAlert className="h-6 w-6 text-[#F59E0B] mb-3" />
              <h2 className="font-semibold serif text-xl mb-2">Safety Rule</h2>
              <p className="text-sm text-slate-300">
                Do not post confidential names, FIR details, addresses, phone numbers, case files, or private accusations in the public feed.
              </p>
            </div>
          </aside>

          <section className="lg:col-span-6 space-y-6">
            <form onSubmit={handlePost} className="bg-white border border-slate-200 shadow-sm rounded-sm p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-5 w-5 text-[#B45309]" />
                <h2 className="text-xl font-semibold serif text-[#0F172A]">Share a justice update</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-white rounded-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Legal Awareness">Legal Awareness</SelectItem>
                    <SelectItem value="News Explainer">News Explainer</SelectItem>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Help Request">Help Request</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white rounded-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!canPost}
                placeholder={canPost ? 'Share a legal awareness note, article idea, justice news explainer, or safe help request...' : 'Login to post on the justice feed'}
                className="min-h-[120px] rounded-sm border-slate-200"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                <p className="text-xs text-slate-500">General information only. Public posts should not reveal sensitive case facts.</p>
                <Button disabled={!canPost || !content.trim()} className="bg-[#B45309] text-white hover:bg-[#B45309]/90 rounded-sm">Publish</Button>
              </div>
            </form>

            {loading ? (
              <div className="text-center py-10 text-slate-500">Loading justice feed...</div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="bg-white border border-slate-200 shadow-sm rounded-sm p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[#0F172A]">{post.author_name}</h3>
                        <span className="text-xs uppercase tracking-wider text-slate-500">{post.author_role}</span>
                        {post.verified && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-xs font-bold rounded-sm">
                            <BadgeCheck className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{formatTime(post.created_at)} · {post.type} · {post.category}</p>
                    </div>
                    <Button onClick={() => handleReport(post)} variant="ghost" className="h-8 px-2 text-slate-500 hover:text-red-600">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-5 pt-4 border-t border-slate-100 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-[#B45309]" /> {post.reactions}</span>
                    <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#0F766E]" /> {post.comments}</span>
                    <Link to="/advocates" className="sm:ml-auto text-[#B45309] font-medium hover:underline">Find relevant advocates</Link>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-5">
              <Newspaper className="h-6 w-6 text-[#B45309] mb-3" />
              <h2 className="font-semibold serif text-xl text-[#0F172A] mb-3">Topic Watchlist</h2>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((item) => (
                  <span key={item} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 text-xs rounded-sm">{item}</span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-5">
              <h2 className="font-semibold serif text-xl text-[#0F172A] mb-3">Need private help?</h2>
              <p className="text-sm text-slate-600 mb-4">Use AI for general learning, then request a consultation with a verified advocate.</p>
              <div className="space-y-2">
                <Link to="/ai-learning"><Button variant="outline" className="w-full rounded-sm">Ask AI</Button></Link>
                <Link to="/advocates"><Button className="w-full bg-[#0F172A] text-white rounded-sm">Find Advocates</Button></Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default JusticeFeed;
