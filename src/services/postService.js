import { supabase } from '@/lib/supabaseClient';

export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(name, role)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createPost = async ({ authorId, type, category, content, isAnonymous, isVerified }) => {
  const { error } = await supabase.from('posts').insert({
    author_id: authorId,
    type,
    category,
    content,
    status: 'published',
    author_verified: isVerified,
    is_anonymous: isAnonymous
  });
  if (error) throw error;
};
