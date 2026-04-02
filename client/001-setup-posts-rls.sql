-- 1. Enable RLS on the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read" ON public.posts;
DROP POLICY IF EXISTS "Allow authors to create posts" ON public.posts;
DROP POLICY IF EXISTS "temp allow insert" ON public.posts;
DROP POLICY IF EXISTS "Allow update for author and admin" ON public.posts;
DROP POLICY IF EXISTS "Allow delete for author and admin" ON public.posts;

-- 3. SELECT POLICY: Anyone can view posts
CREATE POLICY "Allow public read"
ON public.posts
FOR SELECT
USING (true);

-- 4. INSERT POLICY: Authors create posts matched to their own user ID
CREATE POLICY "Allow authors to create posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = author_id
);

-- 5. UPDATE POLICY: Authors edit their own, admins edit everything
CREATE POLICY "Allow update for author and admin"
ON public.posts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = author_id
  OR EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- 6. DELETE POLICY: Authors delete their own, admins delete everything
CREATE POLICY "Allow delete for author and admin"
ON public.posts
FOR DELETE
TO authenticated
USING (
  auth.uid() = author_id
  OR EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
