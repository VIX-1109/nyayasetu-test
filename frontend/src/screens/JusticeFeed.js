import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import { useJusticeFeed } from '@/hooks/useJusticeFeed';
import { getLegalNews } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Scale, BadgeCheck, Flag, Heart, MessageCircle, Newspaper,
  ShieldAlert, Send, User, Share2, AlertCircle, EyeOff,
  UserCircle, PenTool, Image as ImageIcon, Video, FileText,
  Info, TrendingUp, Flame, ChevronRight, ArrowRight,
  Repeat2, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import AccountMenu from '@/components/AccountMenu';
import MobileNav from '@/components/MobileNav';
import NotificationBell from '@/components/NotificationBell';
import { formatRelativeTime as formatTime } from '@/lib/utils';

const trendingTopics = [
  { icon: ShieldAlert, label: 'Consumer Fraud', count: '240 active', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Scale, label: 'Tenant Dispute', count: '156 active', color: 'text-blue-600 bg-blue-50' },
  { icon: Flame, label: 'Property Law', count: '98 active', color: 'text-orange-600 bg-orange-50' },
  { icon: TrendingUp, label: 'Women Safety', count: '87 active', color: 'text-purple-600 bg-purple-50' },
];

const ALL_CATEGORIES = ['All', 'Legal News', 'Help Request', 'Article', 'Short Update', 'Consumer Rights', 'Property Law', 'Family Law', 'Criminal Law', 'Tenant Rights', 'RTI', 'Employment'];
const POST_CATEGORIES = ['Consumer Rights', 'Property Law', 'Family Law', 'Employment', 'Criminal Law', 'Women Safety', 'RTI', 'Tenant Rights'];

const SkeletonPost = () => (
  <div className="bg-white border border-slate-200 rounded-sm p-6 animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-32 bg-slate-200 rounded" />
        <div className="h-2.5 w-48 bg-slate-100 rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-5/6 bg-slate-100 rounded" />
      <div className="h-3 w-4/6 bg-slate-100 rounded" />
    </div>
    <div className="flex gap-4 pt-2 border-t border-slate-100">
      <div className="h-8 w-24 bg-slate-100 rounded" />
      <div className="h-8 w-24 bg-slate-100 rounded" />
    </div>
  </div>
);

const PostCard = ({ post, user, onLike, onComment, onReport }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  const displayRole = post.author_role === 'client' ? 'Citizen' : post.author_role;

  const roleColor = post.is_anonymous
    ? 'bg-slate-900 text-white'
    : post.author_role === 'advocate'
    ? 'bg-[#B45309] text-white'
    : post.author_role === 'admin'
    ? 'bg-slate-900 text-white'
    : 'bg-slate-100 text-slate-600';

  const typeColor = {
    'Legal News': 'bg-blue-50 text-blue-700 border-blue-100',
    'Help Request': 'bg-red-50 text-red-700 border-red-100',
    'Article': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Short Update': 'bg-slate-100 text-slate-600 border-slate-200',
  }[post.type] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <article className="bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Post type accent bar */}
      <div className={`h-1 w-full ${
        post.type === 'Legal News' ? 'bg-blue-500' :
        post.type === 'Help Request' ? 'bg-red-500' :
        post.type === 'Article' ? 'bg-emerald-500' :
        'bg-slate-300'
      }`} />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
              post.is_anonymous ? 'bg-slate-900 border-slate-700' :
              post.author_role === 'advocate' ? 'bg-[#B45309]/10 border-[#B45309]/20' :
              'bg-slate-100 border-slate-200'
            }`}>
              {post.is_anonymous
                ? <UserCircle className="h-5 w-5 text-white" />
                : <User className={`h-5 w-5 ${post.author_role === 'advocate' ? 'text-[#B45309]' : 'text-slate-400'}`} />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#0F172A] text-sm">{post.author_name}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${roleColor}`}>
                  {post.is_anonymous ? 'Anonymous' : displayRole}
                </span>
                {post.verified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(post.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColor}`}>
              {post.type}
            </span>
            <Button
              onClick={() => onReport(post.id)}
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-sm"
            >
              <Flag className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Category tag */}
        <div className="mb-3">
          <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest">
            #{post.category?.replace(' ', '')}
          </span>
        </div>

        {/* Content */}
        <p className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap mb-4">
          {post.content}
        </p>

        {/* Help request warning */}
        {post.type === 'Help Request' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-sm flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-red-800 leading-tight">
              Do not share sensitive personal details publicly. Use 1:1 consultation for private cases.
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
          <Button
            onClick={() => onLike(post.id)}
            variant="ghost"
            size="sm"
            className={`flex-1 h-9 gap-1.5 font-bold text-xs rounded-sm transition-all ${
              post.has_liked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${post.has_liked ? 'fill-current' : ''}`} />
            {post.reactions}
          </Button>
          <Button
            onClick={() => setShowComments(!showComments)}
            variant="ghost"
            size="sm"
            className="flex-1 h-9 gap-1.5 font-bold text-xs rounded-sm text-slate-500 hover:bg-slate-50"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments_count}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toast.info('Share coming soon!')}
            className="h-9 w-9 text-slate-400 hover:text-[#0F172A] hover:bg-slate-50 rounded-sm"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="bg-slate-50 border-t border-slate-100 p-5 space-y-4">
          <div className="space-y-3 max-h-52 overflow-y-auto">
            {post.comments?.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">No comments yet. Be the first.</p>
            )}
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <div className="flex-1 bg-white p-3 rounded-sm border border-slate-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-[#0F172A]">{comment.author}</span>
                    <span className="text-[10px] text-slate-400">{comment.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? 'Add a comment...' : 'Login to comment'}
              disabled={!user}
              className="flex-1 h-10 bg-white border border-slate-200 rounded-sm px-4 text-xs focus:outline-none focus:border-[#0F172A] transition-colors"
            />
            <Button
              type="submit"
              disabled={!user || !commentText.trim()}
              className="bg-[#0F172A] h-10 px-4 rounded-sm"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </article>
  );
};

const PostComposerDialog = ({ user, isModalOpen, setIsModalOpen, content, setContent, type, setType, category, setCategory, isAnonymous, setIsAnonymous, handlePost }) => (
  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogTrigger asChild>
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <User className="h-5 w-5 text-slate-300" />
        </div>
        <div className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm h-11 px-4 flex items-center transition-colors">
          <span className="text-sm text-slate-400 font-medium">Share a legal update or ask for help...</span>
        </div>
        <Button className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-11 px-5 rounded-sm font-bold shrink-0">
          <PenTool className="h-4 w-4 mr-2" /> Post
        </Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-xl rounded-sm p-0 overflow-hidden">
      <DialogHeader
        className="px-6 py-5 border-b border-slate-100"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <DialogTitle className="serif text-xl text-white flex items-center gap-3">
          <div className="bg-[#B45309]/20 p-2 rounded-sm">
            <PenTool className="h-4 w-4 text-[#B45309]" />
          </div>
          Create a Post
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handlePost} className="p-6 space-y-5">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            isAnonymous ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            {isAnonymous
              ? <UserCircle className="h-5 w-5 text-white" />
              : <User className="h-5 w-5 text-slate-400" />
            }
          </div>
          <div>
            <p className="font-bold text-sm text-[#0F172A]">{isAnonymous ? 'Public Voice' : user?.name}</p>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border transition-all flex items-center gap-1 mt-1 ${
                isAnonymous ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              {isAnonymous ? <EyeOff className="h-2.5 w-2.5" /> : <UserCircle className="h-2.5 w-2.5" />}
              {isAnonymous ? 'Anonymous ON' : 'Post Anonymously'}
            </button>
          </div>
        </div>

        {/* Type & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10 rounded-sm bg-slate-50 border-slate-200 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Short Update">Short Update</SelectItem>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="Legal News">Legal News</SelectItem>
                <SelectItem value="Help Request">Help Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 rounded-sm bg-slate-50 border-slate-200 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {POST_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to share?"
          className="min-h-[160px] text-sm border-slate-200 focus:border-[#0F172A] resize-none rounded-sm bg-slate-50"
        />

        {type === 'Help Request' && (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-sm flex gap-3">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Your request will be visible to all advocates. Avoid sharing bank details or exact addresses publicly.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="flex gap-1">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-[#B45309] rounded-sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-[#B45309] rounded-sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-[#B45309] rounded-sm">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="submit"
            disabled={!content.trim()}
            className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-10 px-8 rounded-sm font-bold"
          >
            Publish Post
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

const NewsCard = ({ article, user, onRetweet }) => (
  <div className="bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
    {article.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={article.image} alt="" className="w-full h-40 object-cover" />
    ) : (
      <div
        className="w-full h-40 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}
      >
        <Newspaper className="h-10 w-10 text-white/30" />
      </div>
    )}
    <div className="p-5 flex-1 flex flex-col">
      <span className="text-[9px] font-black text-[#B45309] uppercase tracking-widest">{article.tag}</span>
      <h3 className="serif font-semibold text-[#0F172A] leading-snug mt-2 mb-2 line-clamp-2">{article.title}</h3>
      {article.summary && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">{article.summary}</p>
      )}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-[#0F172A] truncate">{article.source}</p>
          <p className="text-[10px] text-slate-400">{article.time_label}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-sm px-2.5 py-1.5 hover:bg-blue-100 transition-colors"
            >
              <ExternalLink className="h-3 w-3" /> Read
            </a>
          )}
          <button
            onClick={() => onRetweet(article)}
            disabled={!user}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-sm px-2.5 py-1.5 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Repeat2 className="h-3 w-3" /> Retweet
          </button>
        </div>
      </div>
    </div>
  </div>
);

const RetweetDialog = ({ open, setOpen, article, onSubmit }) => {
  const [caption, setCaption] = useState('');

  useEffect(() => { if (open) setCaption(''); }, [open, article]);

  if (!article) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(article, caption);
    if (ok) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg rounded-sm p-0 overflow-hidden">
        <DialogHeader
          className="px-6 py-5 border-b border-slate-100"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
        >
          <DialogTitle className="serif text-xl text-white flex items-center gap-3">
            <div className="bg-[#B45309]/20 p-2 rounded-sm">
              <Repeat2 className="h-4 w-4 text-[#B45309]" />
            </div>
            Share to Justice Feed
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Article preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
            <span className="text-[9px] font-black text-[#B45309] uppercase tracking-widest">{article.tag}</span>
            <p className="text-sm font-semibold text-[#0F172A] leading-snug mt-1">{article.title}</p>
            <p className="text-[11px] text-slate-400 mt-1">{article.source} · {article.time_label}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Your caption <span className="font-medium normal-case tracking-normal text-slate-400">(min 30 characters)</span>
            </label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add your thoughts — what does this mean for citizens?"
              className="min-h-[110px] text-sm border-slate-200 focus:border-[#0F172A] resize-none rounded-sm bg-slate-50"
            />
            <p className="text-[11px] text-slate-400 text-right">{caption.trim().length} / 30 min</p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">Source credit is attached automatically.</p>
            <Button
              type="submit"
              disabled={caption.trim().length < 30}
              className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-10 px-6 rounded-sm font-bold"
            >
              <Repeat2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const JusticeFeed = ({ user, logout }) => {
  const {
    posts, loading,
    content, setContent,
    type, setType,
    category, setCategory,
    isAnonymous, setIsAnonymous,
    isModalOpen, setIsModalOpen,
    handlePost, handleLike, handleComment, handleReport, handleRetweet
  } = useJusticeFeed(user);

  const [activeView, setActiveView] = useState('feed'); // 'feed' | 'news'
  const [activeCategory, setActiveCategory] = useState('All');
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // Retweet dialog
  const [retweetOpen, setRetweetOpen] = useState(false);
  const [retweetArticle, setRetweetArticle] = useState(null);
  const openRetweet = (article) => { setRetweetArticle(article); setRetweetOpen(true); };

  useEffect(() => {
    let active = true;
    getLegalNews(12)
      .then((items) => { if (active) setNews(items); })
      .catch(() => { if (active) setNews([]); })
      .finally(() => { if (active) setNewsLoading(false); });
    return () => { active = false; };
  }, []);

  const sidebarNews = news.slice(0, 5);

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.type === activeCategory || p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Nav */}
      <nav className="ns-nav sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={32} />
          </Link>
          <div className="hidden md:flex ns-nav-links">
            <Link href="/advocates" className="text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">Find Advocates</Link>
            <Link href="/ai-learning" className="text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">AI Learning</Link>
            <NotificationBell user={user} />
            <AccountMenu user={user} logout={logout} />
          </div>
          <div className="flex md:hidden items-center gap-2">
            <NotificationBell user={user} />
            <AccountMenu user={user} logout={logout} />
            <MobileNav user={user} logout={logout} />
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div
        className="w-full px-4 sm:px-6 md:px-12 lg:px-24 py-10 md:py-14"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[#B45309] text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Newspaper className="h-3.5 w-3.5" /> Community Feed
            </p>
            <h1 className="text-3xl md:text-4xl font-bold serif text-white">Justice Feed</h1>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Advocates share legal awareness. Citizens ask for help. Everyone learns together — openly and safely.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/10 border border-white/20 rounded-sm px-4 py-3">
                <p className="text-xl font-black text-white">{posts.length}+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Posts</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-sm px-4 py-3">
                <p className="text-xl font-black text-white">Live</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Feed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary tabs: Justice Feed | Legal News */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/10">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('feed')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-bold transition-all ${
                activeView === 'feed'
                  ? 'bg-white text-[#0F172A] shadow-lg'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              <MessageCircle className="h-4 w-4" /> Justice Feed
            </button>
            <button
              onClick={() => setActiveView('news')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-bold transition-all ${
                activeView === 'news'
                  ? 'bg-white text-[#0F172A] shadow-lg'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              <Newspaper className="h-4 w-4" /> Legal News
            </button>
          </div>

          {/* Category filter tabs — only on the Justice Feed tab */}
          {activeView === 'feed' && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mt-4">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#B45309] text-white shadow-lg'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="ns-page py-8">
        <div className="max-w-7xl mx-auto">
        {activeView === 'feed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Feed — center */}
          <section className="lg:col-span-8 space-y-5">

            {/* Post composer */}
            {user && (
              <PostComposerDialog
                user={user}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                content={content}
                setContent={setContent}
                type={type}
                setType={setType}
                category={category}
                setCategory={setCategory}
                isAnonymous={isAnonymous}
                setIsAnonymous={setIsAnonymous}
                handlePost={handlePost}
              />
            )}

            {/* Results label */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {loading ? 'Loading...' : `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''} ${activeCategory !== 'All' ? `in ${activeCategory}` : ''}`}
              </p>
              {activeCategory !== 'All' && (
                <button
                  onClick={() => setActiveCategory('All')}
                  className="text-xs text-[#B45309] font-bold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => <SkeletonPost key={i} />)}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-sm p-16 text-center space-y-3">
                <Newspaper className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-semibold serif">No posts in this category yet.</p>
                <p className="text-slate-400 text-sm">Be the first to share something.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  onLike={handleLike}
                  onComment={handleComment}
                  onReport={handleReport}
                />
              ))
            )}
          </section>

          {/* Sidebar — right */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Live News */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <div
                className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
                style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}
              >
                <h3 className="font-bold serif text-[#0F172A] flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-[#B45309]" /> Legal News
                </h3>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {newsLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="px-5 py-4 animate-pulse space-y-2">
                      <div className="h-2 w-20 bg-slate-100 rounded" />
                      <div className="h-3.5 w-full bg-slate-100 rounded" />
                      <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
                    </div>
                  ))
                ) : sidebarNews.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-xs text-slate-400">No legal news yet.</p>
                    <p className="text-[10px] text-slate-300 mt-1">Check back shortly.</p>
                  </div>
                ) : (
                  sidebarNews.map((item, i) => {
                    const Wrapper = item.url ? 'a' : 'div';
                    const wrapperProps = item.url
                      ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
                      : {};
                    return (
                      <Wrapper
                        key={i}
                        {...wrapperProps}
                        className="block px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <span className="text-[9px] font-black text-[#B45309] uppercase tracking-widest">{item.tag}</span>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug mt-1 group-hover:text-[#B45309] transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                          {item.source ? `${item.source} · ` : ''}{item.time_label}
                        </p>
                      </Wrapper>
                    );
                  })
                )}
              </div>
              <div className="px-5 py-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveView('news')}
                  className="w-full text-xs font-bold text-[#B45309] hover:underline flex items-center justify-center gap-1"
                >
                  View all legal news <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <div
                className="px-5 py-4 border-b border-slate-100"
                style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}
              >
                <h3 className="font-bold serif text-[#0F172A] flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#B45309]" /> Trending Now
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => setActiveCategory(topic.label)}
                    className="w-full flex items-center gap-3 p-3 rounded-sm hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group text-left"
                  >
                    <div className={`p-2 rounded-sm ${topic.color}`}>
                      <topic.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0F172A]">{topic.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{topic.count}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#B45309] transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Find an Advocate CTA */}
            <div
              className="rounded-sm p-6 space-y-4 overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
            >
              <Scale className="absolute -right-6 -bottom-6 h-24 w-24 text-white/5" />
              <p className="text-[#B45309] text-xs font-black uppercase tracking-widest">Need Help?</p>
              <h3 className="text-xl font-bold serif text-white leading-tight">
                Connect with a Verified Advocate
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Find a specialist for your legal issue — property, family, criminal, consumer, and more.
              </p>
              <Link href="/advocates">
                <Button className="w-full bg-[#B45309] text-white hover:bg-[#B45309]/90 h-11 rounded-sm font-bold">
                  Find an Advocate <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Footer links */}
            <div className="text-center space-y-2 pb-4">
              <div className="flex flex-wrap justify-center gap-3 text-[10px] text-slate-400 font-medium">
                <Link href="/privacy" className="hover:text-[#0F172A] transition-colors">Privacy</Link>
                <span>·</span>
                <Link href="/terms" className="hover:text-[#0F172A] transition-colors">Terms</Link>
                <span>·</span>
                <Link href="/contact" className="hover:text-[#0F172A] transition-colors">Contact</Link>
              </div>
              <p className="text-[10px] text-slate-300">© 2026 NyayaSetu</p>
            </div>

          </aside>
        </div>
        ) : (
          /* ── Legal News tab ── */
          <section>
            <div className="flex items-center justify-between mb-5 px-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {newsLoading ? 'Loading legal news…' : `${news.length} legal news update${news.length !== 1 ? 's' : ''}`}
              </p>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live
              </span>
            </div>

            {newsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-sm overflow-hidden animate-pulse">
                    <div className="h-40 bg-slate-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-2 w-20 bg-slate-100 rounded" />
                      <div className="h-4 w-full bg-slate-100 rounded" />
                      <div className="h-4 w-4/5 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-sm p-16 text-center space-y-3">
                <Newspaper className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-semibold serif">No legal news yet.</p>
                <p className="text-slate-400 text-sm">Live Indian legal news will appear here shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {news.map((article, i) => (
                  <NewsCard key={i} article={article} user={user} onRetweet={openRetweet} />
                ))}
              </div>
            )}
          </section>
        )}
        </div>
      </main>

      <RetweetDialog
        open={retweetOpen}
        setOpen={setRetweetOpen}
        article={retweetArticle}
        onSubmit={handleRetweet}
      />
    </div>
  );
};

export default JusticeFeed;
