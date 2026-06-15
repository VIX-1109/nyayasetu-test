import { supabase } from '@/lib/supabaseClient';

// Reads the live legal-news batch that LexFeed stores in the shared
// `legal_news` table. Public-read, so no auth needed. Returns [] if the
// table is empty or not yet created (sidebar shows an empty state).
export const getLegalNews = async (limit = 6) => {
  const { data, error } = await supabase
    .from('legal_news')
    .select('tag, title, summary, url, image, time_label, source')
    .order('position', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data || [];
};
