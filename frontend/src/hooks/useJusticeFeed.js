import { useState, useEffect } from 'react';
import { getPosts, createPost, createComment, toggleReaction, reportPost } from '@/services/postService';
import { getRankedPostIds, enrichPost, logInteraction } from '@/services/lexfeedService';
import { supabase } from '@/lib/supabaseClient';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

// Reorder Supabase posts by LexFeed's ranked id list. Posts not in the
// ranked list keep their existing (newest-first) order at the end.
const applyRanking = (posts, rankedIds) => {
  if (!rankedIds?.length) return posts;
  const rank = new Map(rankedIds.map((id, i) => [id, i]));
  return [...posts].sort((a, b) => {
    const ra = rank.has(a.id) ? rank.get(a.id) : Number.POSITIVE_INFINITY;
    const rb = rank.has(b.id) ? rank.get(b.id) : Number.POSITIVE_INFINITY;
    return ra - rb;
  });
};

const demoPosts = [
  {
    id: 'demo-tenant-rights',
    author_name: 'Adv. Meera Joshi',
    author_role: 'advocate',
    verified: true,
    type: 'Legal News',
    category: 'Tenant Rights',
    content: 'The new rental act updates in Maharashtra emphasize that security deposits cannot exceed two months of rent for residential properties. Ensure your agreements are updated accordingly.',
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    reactions: 28,
    comments_count: 6,
    has_liked: false,
    comments: [
      { id: 1, author: 'Suresh K.', content: 'Does this apply to existing agreements?', time: '10m ago' },
      { id: 2, author: 'Adv. Meera Joshi', content: 'It applies to all new agreements and renewals signed after the act notification.', time: '2m ago' }
    ]
  },
  {
    id: 'demo-help',
    author_name: 'Public Voice',
    author_role: 'citizen',
    is_anonymous: true,
    verified: false,
    type: 'Help Request',
    category: 'Property Law',
    content: 'I need to know the standard procedure for getting a khata certificate for a resale property. What are the first 3 documents I should ask the seller for?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    reactions: 12,
    comments_count: 4,
    has_liked: false,
    comments: []
  }
];

export const useJusticeFeed = (user) => {
  const [posts, setPosts] = useState(demoPosts);
  const [content, setContent] = useState('');
  const [type, setType] = useState('Short Update');
  const [category, setCategory] = useState('Tenant Rights');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      if (data?.length) {
        const mapped = data.map(post => ({
          id: post.id,
          author_name: post.is_anonymous ? 'Public Voice' : (post.profiles?.name || 'NyayaSetu Member'),
          author_role: post.profiles?.role || 'member',
          is_anonymous: post.is_anonymous,
          verified: post.author_verified || post.profiles?.role === 'admin',
          type: post.type || 'Short Update',
          category: post.category || 'General',
          content: post.content,
          created_at: post.created_at,
          reactions: post.reactions_count || 0,
          comments_count: post.comments_count || 0,
          has_liked: Boolean(post.post_reactions?.some(reaction => reaction.user_id === user?.id)),
          comments: (post.post_comments || []).map(comment => ({
            id: comment.id,
            author: comment.profiles?.name || 'NyayaSetu Member',
            content: comment.content,
            time: formatRelativeTime(comment.created_at)
          }))
        }));

        // Ask LexFeed for a personalized order; silently keep newest-first if unavailable.
        const rankedIds = await getRankedPostIds(user?.id);
        setPosts(applyRanking(mapped, rankedIds));
      }
    } catch (error) {
      toast.error('Could not load live feed. Showing demo posts.');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    const newPost = {
      id: `local-${Date.now()}`,
      author_name: isAnonymous ? 'Public Voice' : user.name,
      author_role: user.role,
      is_anonymous: isAnonymous,
      verified: !isAnonymous && (user.role === 'admin' || user.role === 'advocate'),
      type, category,
      content: content.trim(),
      created_at: new Date().toISOString(),
      reactions: 0, comments_count: 0, has_liked: false, comments: []
    };

    try {
      const savedPost = await createPost({
        authorId: user.id, type, category,
        content: newPost.content,
        isVerified: newPost.verified,
        isAnonymous
      });
      setPosts(prev => [{
        ...newPost,
        id: savedPost.id,
        created_at: savedPost.created_at
      }, ...prev]);
      enrichPost(savedPost.id, newPost.content); // classify + embed for ranking
      setContent('');
      setIsAnonymous(false);
      setIsModalOpen(false);
      toast.success('Post published!');
    } catch (error) {
      toast.error('Could not publish post.');
    }
  };

  const handleLike = async (postId) => {
    if (!user) { toast.error('Please login to react to posts.'); return; }
    const target = posts.find(post => post.id === postId);
    if (!target) return;

    try {
      const hasReacted = await toggleReaction({ postId, userId: user.id, hasReacted: target.has_liked });
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, has_liked: hasReacted, reactions: hasReacted ? p.reactions + 1 : Math.max(0, p.reactions - 1) }
        : p
      ));
      if (hasReacted) logInteraction(user.id, postId, 'like');
    } catch (error) {
      toast.error('Could not update reaction.');
    }
  };

  const handleComment = async (postId, text) => {
    if (!user) { toast.error('Please login to comment.'); return; }

    try {
      const savedComment = await createComment({ postId, authorId: user.id, content: text });
      logInteraction(user.id, postId, 'comment');
      setPosts(prev => prev.map(p => p.id === postId
        ? {
            ...p,
            comments_count: p.comments_count + 1,
            comments: [...(p.comments || []), {
              id: savedComment.id,
              author: savedComment.profiles?.name || user.name,
              content: savedComment.content,
              time: 'Just now'
            }]
          }
        : p
      ));
    } catch (error) {
      toast.error('Could not add comment.');
    }
  };

  const handleReport = async (postId) => {
    if (!user) { toast.error('Please login to report posts.'); return; }

    try {
      await reportPost({ postId, reporterId: user.id });
      logInteraction(user.id, postId, 'report');
      toast.success('Report sent for admin review.');
    } catch (error) {
      toast.error('Could not report this post.');
    }
  };

  // Share a news article into the Justice Feed as a post
  const handleRetweet = async (article, caption) => {
    if (!user) { toast.error('Please login to share to the feed.'); return false; }
    const text = (caption || '').trim();
    if (text.length < 30) { toast.error('Add a short caption (at least 30 characters).'); return false; }

    const verified = user.role === 'admin' || user.role === 'advocate';
    const category = article.tag || 'General';
    const content = `${text}\n\n— via ${article.source || 'Legal News'}: ${article.title}${article.url ? `\n${article.url}` : ''}`;

    try {
      const saved = await createPost({
        authorId: user.id,
        type: 'Legal News',
        category,
        content,
        isVerified: verified,
        isAnonymous: false,
      });
      setPosts(prev => [{
        id: saved.id,
        author_name: user.name,
        author_role: user.role,
        is_anonymous: false,
        verified,
        type: 'Legal News',
        category,
        content,
        created_at: saved.created_at,
        reactions: 0, comments_count: 0, has_liked: false, comments: []
      }, ...prev]);
      enrichPost(saved.id, content); // classify + embed for ranking
      toast.success('Shared to Justice Feed!');
      return true;
    } catch (error) {
      toast.error('Could not share this article.');
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();

    // Supabase Realtime — new posts from other users appear instantly without reload
    const channel = supabase
      .channel('posts:feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          const p = payload.new;
          // Skip own posts — already added optimistically in handlePost
          if (p.author_id === user?.id) return;
          setPosts(prev => [{
            id: p.id,
            author_name: p.is_anonymous ? 'Public Voice' : 'NyayaSetu Member',
            author_role: 'member',
            is_anonymous: p.is_anonymous,
            verified: p.author_verified || false,
            type: p.type || 'Short Update',
            category: p.category || 'General',
            content: p.content,
            created_at: p.created_at,
            reactions: 0,
            comments_count: 0,
            has_liked: false,
            comments: []
          }, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  return {
    posts, loading,
    content, setContent,
    type, setType,
    category, setCategory,
    isAnonymous, setIsAnonymous,
    isModalOpen, setIsModalOpen,
    handlePost, handleLike, handleComment, handleReport, handleRetweet
  };
};
