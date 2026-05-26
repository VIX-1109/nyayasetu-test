const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 20;

const getStorageKey = (userId) => `nyayasetu:ai-rate:${userId}`;

export const consumeAiQuerySlot = (userId) => {
  if (typeof window === 'undefined') {
    return { remaining: MAX_REQUESTS - 1, resetAt: new Date(Date.now() + WINDOW_MS) };
  }

  const key = getStorageKey(userId);
  const now = Date.now();
  const stored = window.localStorage.getItem(key);
  const bucket = stored ? JSON.parse(stored) : { count: 0, resetAt: now + WINDOW_MS };

  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }

  if (bucket.count >= MAX_REQUESTS) {
    const resetAt = new Date(bucket.resetAt);
    throw new Error(`AI query limit reached. Try again after ${resetAt.toLocaleTimeString()}.`);
  }

  bucket.count += 1;
  window.localStorage.setItem(key, JSON.stringify(bucket));

  return {
    remaining: MAX_REQUESTS - bucket.count,
    resetAt: new Date(bucket.resetAt),
  };
};
