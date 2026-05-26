import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req) {
  const { receiverId, content, adminNotice = false } = await req.json();
  if (!receiverId || !content?.trim()) {
    return Response.json({ error: 'receiverId and content required' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (adminNotice) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content: adminNotice ? `ADMIN NOTICE: ${content.trim()}` : content.trim(),
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: data }, { status: 201 });
}
