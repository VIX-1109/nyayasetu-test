import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendMessageController } from '../../../../backend/controllers/message.controller.js';

export async function POST(req) {
  try {
    const supabase = await createSupabaseServerClient();
    const result = await sendMessageController(req, supabase);
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to send message' },
      { status: error.status || 500 }
    );
  }
}
