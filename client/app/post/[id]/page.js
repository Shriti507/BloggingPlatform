import CommentSection from "@/components/CommentSection";
import { getPostById, MOCK_POSTS } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return MOCK_POSTS.map((p) => ({ id: p.id }));
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/"
        className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
      >
        ← Home
      </Link>

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

      <CommentSection postId={post.id} />
    </article>
  );
}
