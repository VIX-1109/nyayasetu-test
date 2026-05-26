import { supabase } from '@/lib/supabaseClient';
import {
  AVATAR_BUCKET,
  buildAvatarStoragePath,
  getAvatarPublicUrl,
  validateAvatarFile,
} from '@/lib/avatar';
import { updateOwnProfile } from '@/services/profileService';

export const uploadProfileAvatar = async (userId, file) => {
  validateAvatarFile(file);

  const storagePath = buildAvatarStoragePath(userId, file);
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(storagePath, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const avatarUrl = getAvatarPublicUrl(supabase, storagePath);
  return updateOwnProfile(userId, { avatar_url: avatarUrl });
};

export const removeProfileAvatar = async (userId) => {
  const { data: files, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);

  if (listError) throw listError;

  if (files?.length) {
    const paths = files.map((file) => `${userId}/${file.name}`);
    const { error: removeError } = await supabase.storage.from(AVATAR_BUCKET).remove(paths);
    if (removeError) throw removeError;
  }

  return updateOwnProfile(userId, { avatar_url: null });
};
