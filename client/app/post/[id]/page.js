import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import { getPostById } from "@/lib/mockData";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" }, { id: "8" }, { id: "9" }];
}

export default function PostPage({ params }) {
  const post = getPostById(params.id);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-neutral-200 pb-8">
        <p className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-800">{post.author}</span>
          <span className="mx-2 text-neutral-300">·</span>
          {post.publishedAt}
          <span className="mx-2 text-neutral-300">·</span>
          {post.readMinutes} min read
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">{post.summary}</p>
      </div>

      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <div className="mt-10 max-w-none">
        {paragraphs.map((block, i) => (
          <p key={i} className="mb-6 font-serif text-[19px] leading-[1.75] text-neutral-800">
            {block.trim()}
          </p>
        ))}
      </div>

      <div className="mt-12 flex justify-between border-t border-neutral-200 pt-8 text-sm">
        <Link href="/" className="font-medium text-[#1a8917] hover:underline">
          ← All stories
        </Link>
        <Link href="/create" className="text-neutral-600 hover:text-neutral-900">
          Write a response
        </Link>
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
