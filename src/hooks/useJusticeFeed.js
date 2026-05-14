import { useState, useEffect } from 'react';
import { getPosts, createPost } from '@/services/postService';
import { toast } from 'sonner';

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
        setPosts(data.map(post => ({
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
          has_liked: false,
          comments: []
        })));
      }
    } catch (error) {
      // Fallback to demo posts
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

    setPosts(prev => [newPost, ...prev]);
    setContent('');
    setIsAnonymous(false);
    setIsModalOpen(false);
    toast.success('Post published!');

    try {
      await createPost({
        authorId: user.id, type, category,
        content: newPost.content,
        isVerified: newPost.verified,
        isAnonymous
      });
    } catch (error) {}
  };

  const handleLike = (postId) => {
    if (!user) { toast.error('Please login to react to posts.'); return; }
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, has_liked: !p.has_liked, reactions: p.has_liked ? p.reactions - 1 : p.reactions + 1 }
      : p
    ));
  };

  const handleComment = (postId, text) => {
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, comments_count: p.comments_count + 1, comments: [...(p.comments || []), { id: Date.now(), author: user.name, content: text, time: 'Just now' }] }
      : p
    ));
  };

  useEffect(() => { fetchPosts(); }, []);

  return {
    posts, loading,
    content, setContent,
    type, setType,
    category, setCategory,
    isAnonymous, setIsAnonymous,
    isModalOpen, setIsModalOpen,
    handlePost, handleLike, handleComment
  };
};
