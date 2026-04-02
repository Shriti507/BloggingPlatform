-- Explorer blogging platform — Row Level Security
-- Run in Supabase SQL Editor. Drops are idempotent for re-runs.
-- If your column names differ (e.g. `content` instead of `body`), align tables first.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_all" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

DROP POLICY IF EXISTS "posts_select_all" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_by_author_role" ON public.posts;
DROP POLICY IF EXISTS "posts_update_own_or_admin" ON public.posts;

DROP POLICY IF EXISTS "comments_select_all" ON public.comments;
DROP POLICY IF EXISTS "comments_insert_own" ON public.comments;
DROP POLICY IF EXISTS "comments_delete_admin" ON public.comments;

CREATE POLICY "users_select_all"
  ON public.users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "posts_select_all"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "posts_insert_by_author_role"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('author', 'admin')
    )
  );

CREATE POLICY "posts_update_own_or_admin"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "comments_select_all"
  ON public.comments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "comments_insert_own"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments_delete_admin"
  ON public.comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
