-- Run in this project's Supabase SQL Editor only if anonymous file listing
-- is not already allowed. This grants read access only to multimedia assets
-- in the already-public Portfolio bucket, with no upload/update/delete access.
-- Folder names and paths are case-sensitive.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Portfolio public multimedia read'
  ) THEN
    CREATE POLICY "Portfolio public multimedia read"
      ON storage.objects FOR SELECT TO anon
      USING (
        bucket_id = 'Portfolio'
        AND name LIKE 'assets/MULTIMEDIA/%'
      );
  END IF;
END
$$;
