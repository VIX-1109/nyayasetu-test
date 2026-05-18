import { supabase } from '@/lib/supabaseClient';

export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(name, role),
      post_comments(
        id,
        content,
        created_at,
        profiles(name, role)
      ),
      post_reactions(user_id)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createPost = async ({ authorId, type, category, content, isAnonymous, isVerified }) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: authorId,
      type,
      category,
      content,
      status: 'published',
      author_verified: isVerified,
      is_anonymous: isAnonymous
    })
    .select('*, profiles(name, role)')
    .single();
  if (error) throw error;
  return data;
};

export const createComment = async ({ postId, authorId, content }) => {
  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      content,
      status: 'published'
    })
    .select('id, content, created_at, profiles(name, role)')
    .single();
  if (error) throw error;
  return data;
};

export const toggleReaction = async ({ postId, userId, hasReacted }) => {
  if (hasReacted) {
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase
    .from('post_reactions')
    .upsert({
      post_id: postId,
      user_id: userId,
      reaction: 'support'
    }, { onConflict: 'post_id,user_id' });
  if (error) throw error;
  return true;
};

export const reportPost = async ({ postId, reporterId, reason = 'needs_review' }) => {
  const { error } = await supabase
    .from('post_reports')
    .upsert({
      post_id: postId,
      reporter_id: reporterId,
      reason,
      status: 'open'
    }, { onConflict: 'post_id,reporter_id' });
  if (error) throw error;
};

export const getReportedPosts = async () => {
  const { data, error } = await supabase
    .from('post_reports')
    .select('id, status, reason, created_at, posts(id, content, status, reports_count, profiles(name, role))')
    .in('status', ['open', 'reviewing'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updatePostStatus = async (postId, status) => {
  const { error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId);
  if (error) throw error;
};
