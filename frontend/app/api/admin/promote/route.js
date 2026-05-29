import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { promoteAdminController } from '../../../../../backend/controllers/admin.controller.js';

export async function POST(req) {
  try {
    const supabase = await createSupabaseServerClient();
    const result = await promoteAdminController(req, supabase);
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to promote user' },
      { status: error.status || 403 }
    );
  }
}
