-- Add media columns to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_url  TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type TEXT; -- 'image' | 'video' | 'document'

-- Create post-media storage bucket (public, 50 MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-media',
  'post-media',
  true,
  52428800,
  ARRAY[
    'image/jpeg','image/png','image/gif','image/webp',
    'video/mp4','video/quicktime','video/webm',
    'application/pdf'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Anyone can view post media
DROP POLICY IF EXISTS "Post media is publicly readable" ON storage.objects;
CREATE POLICY "Post media is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');

-- Authenticated users can upload into their own folder
DROP POLICY IF EXISTS "Authenticated users can upload post media" ON storage.objects;
CREATE POLICY "Authenticated users can upload post media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'post-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own uploads
DROP POLICY IF EXISTS "Users can delete own post media" ON storage.objects;
CREATE POLICY "Users can delete own post media"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'post-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
