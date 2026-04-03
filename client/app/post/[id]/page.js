import AISummaryCard from "@/components/AISummaryCard";
import BlogPostContent from "@/components/BlogPostContent";
import CommentSection from "@/components/CommentSection";
import { canEditPost, isAdminRole } from "@/lib/auth/roleChecks";
import { createClient } from "@/lib/supabase/server";
import { fetchCommentsForPost } from "@/services/commentService";
import { fetchPostById } from "@/services/postService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { post } = await fetchPostById(id);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.summary?.slice(0, 160) || "",
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const { post, error } = await fetchPostById(id);
  if (error || !post) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let canEdit = false;
  if (user) {
    const { data: prof } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = isAdminRole(prof?.role);
    canEdit = canEditPost({
      role: prof?.role,
      userId: user.id,
      postAuthorId: post.authorId,
    });
  }

  const { comments: initialComments, error: commentsError } =
    await fetchCommentsForPost(id);

  // Determine AI summary state
  const hasSummary =
    post.summary &&
    post.summary !== "Summary not available" &&
    post.summary.trim().length > 20;

  const summaryStatus = hasSummary ? "success" : "error";

  return (
    <article className="flex-1 pb-16">
      {/* ── Top navigation bar ── */}
      <div className="sticky top-0 z-30 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            id="post-back-link"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Home
          </Link>

          <div className="flex items-center gap-2">
            {canEdit && (
              <Link
                href={`/post/${id}/edit`}
                id="post-edit-link"
                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:bg-neutral-200 hover:text-neutral-900"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero section ── */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="pt-10 sm:pt-14">
          {/* Author & date pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-sm font-bold text-neutral-600">
              {(post.author?.[0] || "A").toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{post.author}</p>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                {post.publishedAt && <span>{post.publishedAt}</span>}
                {post.readMinutes != null && (
                  <>
                    <span className="text-neutral-300">·</span>
                    <span>{post.readMinutes} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1
            id="post-title"
            className="mt-6 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem]"
          >
            {post.title}
          </h1>
        </header>

        {/* ── Hero Image ── */}
        {post.imageUrl && (
          <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm sm:mt-10">
            <Image
              src={post.imageUrl}
              alt={post.title || ""}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* ── AI Summary Section ── */}
        <div className="mt-8 sm:mt-10">
          <AISummaryCard
            summary={hasSummary ? post.summary : ""}
            status={summaryStatus}
          />
        </div>

        {/* ── Blog Body ── */}
        <div className="mt-10 sm:mt-12">
          <BlogPostContent body={post.body} />
        </div>

        {/* ── Divider ── */}
        <div className="mt-14 flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs font-medium tracking-wider text-neutral-400">•••</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        {/* ── Comments ── */}
        <CommentSection
          postId={id}
          initialComments={initialComments}
          isLoggedIn={Boolean(user)}
          isAdmin={isAdmin}
          loadError={commentsError}
        />
      </div>
    </article>
  );
}
