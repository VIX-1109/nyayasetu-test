import { supabase } from '@/lib/supabaseClient';

export const saveAiQuery = async (userId, question, answerSummary) => {
  const { error } = await supabase.from('ai_queries').insert({
    user_id: userId,
    question,
    answer_summary: answerSummary.slice(0, 500),
    category: 'prototype'
  });
  if (error) throw error;
};
