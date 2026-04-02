"use client";

import { useAuth } from "@/context/AuthProvider";
import { canEditPost } from "@/lib/auth/roleChecks";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const { id, title, summary, author, imageUrl, publishedAt, readMinutes, authorId } =
    post;

  const canEdit = canEditPost({
    role: user?.role,
    userId: user?.id,
    postAuthorId: authorId,
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md sm:flex-row">
      <Link
        href={`/post/${id}`}
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-neutral-100 sm:aspect-auto sm:h-44 sm:w-56"
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 224px"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-4">
            <Link href={`/post/${id}`} className="flex-1">
              <h2 className="font-serif text-xl font-semibold leading-snug text-neutral-900 transition group-hover:text-neutral-600">
                {title}
              </h2>
            </Link>
            {canEdit && (
              <Link
                href={`/post/${id}/edit`}
                className="shrink-0 rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                Edit
              </Link>
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {summary}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">{author}</span>
            {publishedAt && (
              <>
                <span className="mx-1.5">·</span>
                {publishedAt}
                {readMinutes != null && (
                  <>
                    <span className="mx-1.5">·</span>
                    {readMinutes} min read
                  </>
                )}
              </>
            )}
          </div>
          <Link
            href={`/post/${id}`}
            className="inline-flex items-center text-sm font-medium text-neutral-900 underline-offset-4 transition hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}
