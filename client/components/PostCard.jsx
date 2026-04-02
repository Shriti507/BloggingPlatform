import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200/90 bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      <Link
        href={`/post/${post.id}`}
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-neutral-100 sm:aspect-auto sm:h-44 sm:w-56"
      >
        <Image
          src={post.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 224px"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
        <div className="space-y-2">
          <Link href={`/post/${post.id}`}>
            <h2 className="font-serif text-xl font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-[#1a8917] sm:text-2xl">
              {post.title}
            </h2>
          </Link>
          <p className="line-clamp-2 text-[15px] leading-relaxed text-neutral-600">{post.summary}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">
            <span className="font-medium text-neutral-700">{post.author}</span>
            {post.publishedAt && (
              <>
                <span className="mx-1.5 text-neutral-300">·</span>
                {post.publishedAt}
              </>
            )}
          </p>
          <Link
            href={`/post/${post.id}`}
            className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
