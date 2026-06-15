// Bridge to the LexFeed ranking/enrichment API.
//
// All calls are best-effort: if NEXT_PUBLIC_LEXFEED_API_URL is unset, or the
// service is unreachable/slow, every function fails silently and the feed
// falls back to its default (newest-first) order. Nothing here can break the
// page — LexFeed is an enhancement, not a dependency.

const BASE = process.env.NEXT_PUBLIC_LEXFEED_API_URL || '';
const TIMEOUT_MS = 4000;

const isEnabled = () => Boolean(BASE);

const withTimeout = async (path, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, { ...options, signal: controller.signal });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

// Returns an array of post IDs in ranked order, or null if ranking is
// unavailable (caller should then keep its existing order).
export const getRankedPostIds = async (userId, tab = 'foryou', limit = 50) => {
  if (!isEnabled() || !userId) return null;
  const data = await withTimeout(`/feed/${userId}?limit=${limit}&tab=${tab}`);
  if (!data?.posts?.length) return null;
  return data.posts.map((p) => p.id).filter(Boolean);
};

// Fire-and-forget: classify + embed a newly created post so it can be ranked.
export const enrichPost = (postId, content) => {
  if (!isEnabled() || !postId || !content) return;
  withTimeout('/enrich', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId, content }),
  });
};

// Fire-and-forget: log an interaction so LexFeed can learn the user's interests.
// action ∈ like | comment | expand | share | report | skip | read
export const logInteraction = (userId, postId, action, durationMs = 0) => {
  if (!isEnabled() || !userId || !postId) return;
  withTimeout('/interact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, post_id: postId, action, duration_ms: durationMs }),
  });
};
