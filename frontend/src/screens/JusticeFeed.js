import { useState } from 'react';
import Link from 'next/link';
import { useJusticeFeed } from '@/hooks/useJusticeFeed';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Scale, BadgeCheck, BookOpen, Flag, Heart, MessageCircle, Newspaper, ShieldAlert, Send, User, Bookmark, Share2, AlertCircle, EyeOff, UserCircle, PenTool, Image as ImageIcon, Video, FileText, ChevronDown, Info } from 'lucide-react';
import { toast } from 'sonner';

const newsItems = [
  { id: 1, title: 'SC expands definition of "Vulnerability"', readers: '12k', time: '2h ago' },
  { id: 2, title: 'New Consumer Protection rules 2024', readers: '8.4k', time: '5h ago' },
  { id: 3, title: 'Digital Personal Data Protection Act updates', readers: '5.1k', time: '8h ago' },
  { id: 4, title: 'Advocates Act: New ethics guidelines', readers: '3.2k', time: '1d ago' }
];

const categories = ['Consumer Rights', 'Property Law', 'Family Law', 'Employment', 'Criminal Law', 'Women Safety', 'RTI', 'Tenant Rights'];

const formatTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
};

const PostCard = ({ post, user, onLike, onComment, onReport }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  const handlePlaceholderAction = (action) => {
    toast.info(`${action} functionality is coming soon!`);
  };

  const displayRole = post.author_role === 'client' ? 'Citizen' : post.author_role;

  return (
    <article className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${
              post.is_anonymous ? 'bg-slate-900 border-slate-800 text-white shadow-lg' :
              post.author_role === 'advocate' ? 'bg-[#B45309]/5 border-[#B45309]/20 text-[#B45309]' : 
              post.author_role === 'admin' ? 'bg-[#0F172A] border-[#0F172A] text-white' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              {post.is_anonymous ? <UserCircle className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-[#0F172A] text-sm hover:underline hover:text-[#B45309] cursor-pointer transition-colors">{post.author_name}</h3>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm border ${
                  post.is_anonymous ? 'bg-slate-900 text-white border-slate-800' :
                  post.author_role === 'advocate' ? 'bg-[#B45309] text-white border-[#B45309]' : 
                  post.author_role === 'admin' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {post.is_anonymous ? 'Public Voice' : displayRole}
                </span>
                {post.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5 flex items-center gap-1">
                {post.type} <span className="opacity-30">|</span> {post.category} <span className="opacity-30">|</span> {formatTime(post.created_at)}
              </p>
            </div>
          </div>
          <Button onClick={() => onReport(post.id)} variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50">
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-slate-800 leading-relaxed whitespace-pre-wrap mb-4 text-[15px] px-0.5">
          {post.content}
        </div>

        {post.type === 'Help Request' && (
          <div className="mb-4 p-3 bg-red-50/50 border-l-4 border-red-500 rounded-r-sm flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-red-900 leading-tight">
              SAFETY: Do not reveal sensitive details publicly. Use 1:1 Consultation for private cases.
            </p>
          </div>
        )}

        <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
          <Button 
            onClick={() => onLike(post.id)}
            variant="ghost"
            size="sm"
            className={`flex-1 h-10 gap-2 font-bold text-xs rounded-sm transition-all ${post.has_liked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Heart className={`h-4 w-4 ${post.has_liked ? 'fill-current' : ''}`} />
            Support ({post.reactions})
          </Button>
          <Button 
            onClick={() => setShowComments(!showComments)}
            variant="ghost"
            size="sm"
            className="flex-1 h-10 gap-2 font-bold text-xs rounded-sm text-slate-500 hover:bg-slate-100"
          >
            <MessageCircle className="h-4 w-4" />
            Comment ({post.comments_count})
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handlePlaceholderAction('Save')} className="h-10 w-10 text-slate-400 hover:text-[#0F172A]"><Bookmark className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handlePlaceholderAction('Share')} className="h-10 w-10 text-slate-400 hover:text-[#0F172A]"><Share2 className="h-4 w-4" /></Button>
        </div>
      </div>

      {showComments && (
        <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-4">
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {post.comments?.map(comment => (
              <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1 bg-white p-2.5 rounded-sm border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-[#0F172A] uppercase tracking-tighter">{comment.author}</span>
                    <span className="text-[9px] font-bold text-slate-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-snug">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitComment} className="flex gap-2 pt-2">
            <input 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 h-10 bg-white border border-slate-200 rounded-full px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#B45309]/20 transition-all shadow-inner"
              disabled={!user}
            />
            <Button type="submit" disabled={!user || !commentText.trim()} className="bg-[#0F172A] h-10 w-10 p-0 rounded-full shadow-lg hover:scale-105 transition-transform">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </article>
  );
};

const JusticeFeed = ({ user, logout }) => {
  const {
    posts,
    loading,
    content,
    setContent,
    type,
    setType,
    category,
    setCategory,
    isAnonymous,
    setIsAnonymous,
    isModalOpen,
    setIsModalOpen,
    handlePost,
    handleLike,
    handleComment,
    handleReport
  } = useJusticeFeed(user);

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      <nav className="ns-nav shadow-sm bg-white border-b border-slate-200">
        <div className="ns-nav-inner max-w-6xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#0F172A] p-1.5 rounded-sm">
              <Scale className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-black serif text-[#0F172A] tracking-tighter">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/advocates" className="shrink-0 text-slate-500 hover:text-[#0F172A] font-bold text-[11px] md:text-xs uppercase tracking-widest flex items-center md:flex-col gap-1"><User className="h-4 w-4 md:h-5 md:w-5" /> Experts</Link>
            <Link href="/ai-learning" className="shrink-0 text-slate-500 hover:text-[#0F172A] font-bold text-[11px] md:text-xs uppercase tracking-widest flex items-center md:flex-col gap-1"><PenTool className="h-4 w-4 md:h-5 md:w-5" /> AI Help</Link>
            {user ? (
              <Link href={user.role === 'admin' ? '/admin' : user.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'}>
                <Button className="bg-[#B45309] text-white h-9 px-4 md:px-5 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-all">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth"><Button className="bg-[#0F172A] text-white h-9 px-4 md:px-5 rounded-full font-bold text-xs">Join Now</Button></Link>
            )}
          </div>
        </div>
      </nav>

      <main className="ns-page py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
          
          {/* Left Column: Profile Snapshot */}
          <aside className="order-2 lg:order-1 lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
              <div className="h-16 bg-gradient-to-r from-[#0F172A] to-[#B45309]"></div>
              <div className="px-5 pb-5 -mt-8 text-center">
                <div className="h-16 w-16 bg-white rounded-full mx-auto border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <User className="h-8 w-8 text-slate-300" />
                </div>
                <h2 className="mt-3 font-bold text-slate-900 serif text-lg">{user?.name || 'Guest'}</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter mt-1">{user?.role === 'client' ? 'Citizen' : (user?.role || 'Welcome')}</p>
                
                <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3">
                  <div className="flex justify-between items-center group cursor-pointer">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Feed Activity</span>
                    <span className="text-xs font-bold text-[#B45309] group-hover:underline">12</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Saved Items</span>
                    <span className="text-xs font-bold text-[#B45309] group-hover:underline">5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Bookmark className="h-3 w-3" /> Recent Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 5).map((c) => (
                  <button key={c} className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded-sm border border-slate-100 hover:bg-[#B45309]/5 hover:text-[#B45309] transition-colors">
                    #{c.replace(' ', '')}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Center Column: Posts */}
          <section className="order-1 lg:order-2 lg:col-span-6 space-y-4">
            {/* Minimal Post Trigger */}
            {user && (
              <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm space-y-3">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                    <User className="h-6 w-6 text-slate-300" />
                  </div>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <button className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-5 text-left text-sm font-medium text-slate-500 transition-colors shadow-inner">
                        Start a legal post or help request...
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl rounded-sm backdrop-blur-xl bg-white/95 border-slate-200 p-0 shadow-2xl">
                      <DialogHeader className="p-6 border-b border-slate-100 bg-white">
                        <DialogTitle className="serif text-2xl text-[#0F172A] flex items-center gap-3">
                          <div className="bg-[#B45309]/10 p-2 rounded-sm"><PenTool className="h-5 w-5 text-[#B45309]" /></div>
                          Create Post
                        </DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handlePost} className="p-6 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                            {isAnonymous ? <UserCircle className="h-7 w-7 text-slate-800" /> : <User className="h-7 w-7 text-slate-400" />}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 text-sm">{isAnonymous ? 'Public Voice' : user.name}</h4>
                            <button 
                              type="button"
                              onClick={() => setIsAnonymous(!isAnonymous)}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border transition-all flex items-center gap-1 ${
                                isAnonymous ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {isAnonymous ? <EyeOff className="h-3 w-3" /> : <UserCircle className="h-3 w-3" />}
                              Post Anonymously: {isAnonymous ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                            <Select value={type} onValueChange={setType}>
                              <SelectTrigger className="h-10 rounded-sm bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                              <SelectContent className="backdrop-blur-md bg-white/95 border-slate-200">
                                <SelectItem value="Short Update">Short Update</SelectItem>
                                <SelectItem value="Article">Article</SelectItem>
                                <SelectItem value="Legal News">Legal News</SelectItem>
                                <SelectItem value="Help Request">Help Request</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger className="h-10 rounded-sm bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                              <SelectContent className="backdrop-blur-md bg-white/95 border-slate-200">
                                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="What do you want to talk about?"
                          className="min-h-[180px] text-lg border-none focus-visible:ring-0 resize-none p-0 bg-transparent placeholder:text-slate-300 placeholder:italic"
                        />

                        {type === 'Help Request' && (
                          <div className="p-3 bg-amber-50 border border-amber-100 rounded-sm flex gap-3 animate-in pulse">
                            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-amber-800 leading-tight">
                              Your request will be visible to all advocates. Avoid sharing bank details or exact addresses.
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-[#B45309] hover:bg-amber-50 rounded-full"><ImageIcon className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-[#B45309] hover:bg-amber-50 rounded-full"><Video className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-[#B45309] hover:bg-amber-50 rounded-full"><FileText className="h-5 w-5" /></Button>
                          </div>
                          <Button disabled={!content.trim()} className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-10 px-8 rounded-full font-bold shadow-xl shadow-[#B45309]/20 hover:scale-105 transition-all">
                            Publish
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex justify-between pt-1">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-sm transition-colors text-xs font-bold text-slate-500 group">
                    <ImageIcon className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" /> Photo
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-sm transition-colors text-xs font-bold text-slate-500 group">
                    <Video className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" /> Video
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-sm transition-colors text-xs font-bold text-slate-500 group">
                    <Newspaper className="h-5 w-5 text-[#B45309] group-hover:scale-110 transition-transform" /> Write article
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 py-2 px-1">
              <hr className="flex-1 border-slate-200" />
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-600 transition-colors">
                Sort by: <span className="text-[#0F172A]">Top</span> <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-20 text-slate-400 font-serif">Loading feed...</div>
              ) : (
                posts.map((post) => (
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
            </div>
          </section>

          {/* Right Column: News & Trending */}
          <aside className="order-3 lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold serif text-[#0F172A] text-lg">NyayaSetu News</h3>
                <div className="bg-slate-100 p-1 rounded-full"><Info className="h-3 w-3 text-slate-500" /></div>
              </div>
              <ul className="space-y-4">
                {newsItems.map((news) => (
                  <li key={news.id} className="group cursor-pointer">
                    <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-[#B45309] group-hover:underline line-clamp-2">
                      * {news.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 pl-3 font-bold uppercase tracking-tighter">
                      {news.time} Â· {news.readers} readers
                    </p>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" className="w-full mt-4 h-8 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#B45309] hover:bg-amber-50">
                Show more <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
              <h3 className="font-bold serif text-[#0F172A] text-sm mb-3">Trending Consultations</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-sm transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-sm"><ShieldAlert className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Consumer Fraud</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">240 Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-sm transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-sm"><Scale className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Tenant Dispute</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">156 Active</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                NyayaSetu Â© 2024. All Rights Reserved.<br />
                About Â· Accessibility Â· Help Center
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default JusticeFeed;

const PenLine = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
