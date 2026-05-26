const AVATAR_BUCKET = 'avatars';
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const MAX_AVATAR_SOURCE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const getAvatarInitials = (user) => {
  const source = user?.name || user?.email || 'NS';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'NS';
};

export const validateAvatarSourceFile = (file) => {
  if (!file) {
    throw new Error('Choose an image file first.');
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Use a JPG, PNG, or WebP image.');
  }
  if (file.size > MAX_AVATAR_SOURCE_BYTES) {
    throw new Error('Image must be 10 MB or smaller.');
  }
};

export const validateAvatarFile = (file) => {
  validateAvatarSourceFile(file);
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Image must be 2 MB or smaller.');
  }
};

export const buildAvatarStoragePath = (userId, file) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExtension = ['jpeg', 'jpg', 'png', 'webp'].includes(extension) ? extension : 'jpg';
  return `${userId}/avatar.${safeExtension === 'jpeg' ? 'jpg' : safeExtension}`;
};

export const getAvatarPublicUrl = (supabase, storagePath) => {
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);
  const baseUrl = data.publicUrl;
  return `${baseUrl}?t=${Date.now()}`;
};

export { AVATAR_BUCKET };
