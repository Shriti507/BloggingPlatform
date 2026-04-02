import CommentSection from "@/components/CommentSection";
import { canEditPost, isAdminRole } from "@/lib/auth/roleChecks";
import { createClient } from "@/lib/supabase/server";
import { fetchCommentsForPost } from "@/services/commentService";
import { fetchPostById } from "@/services/postService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

  const paragraphs = post.body.split("\n\n").filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          ← Home
        </Link>
        {canEdit && (
          <Link
            href={`/post/${id}/edit`}
            className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
          >
            Edit
          </Link>
        )}
      </div>

      <header className="mt-6">
        <h1 className="font-serif text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          <span className="font-medium text-neutral-700">{post.author}</span>
          {post.publishedAt && (
            <>
              <span className="mx-2">·</span>
              {post.publishedAt}
            </>
          )}
          {post.readMinutes != null && (
            <>
              <span className="mx-2">·</span>
              {post.readMinutes} min read
            </>
          )}
        </p>
      </header>

      <div className="relative mt-10 aspect-[2/1] w-full overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          unoptimized
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <div className="prose-custom mt-10">
        {paragraphs.map((block, i) => (
          <p key={i} className="mt-6 first:mt-0 text-base leading-[1.75] text-neutral-800">
            {block}
          </p>
        ))}
      </div>

      <CommentSection
        postId={id}
        initialComments={initialComments}
        isLoggedIn={Boolean(user)}
        isAdmin={isAdmin}
        loadError={commentsError}
      />
    </article>
  );
}
