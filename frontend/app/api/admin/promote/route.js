import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req) {
  const { userId } = await req.json();
  if (!userId) {
    return Response.json({ error: 'userId required' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { error } = await supabase.rpc('promote_user_to_admin', { p_user_id: userId });

  if (error) {
    return Response.json({ error: error.message }, { status: 403 });
  }

  return Response.json({ success: true });
}
