import Link from "next/link";
import PostCard from "./PostCard";

function buildHref(page, query) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return s ? `/?${s}` : "/";
}

export default function PostListSection({
  posts,
  total,
  page,
  pageSize,
  query,
  error,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        Couldn&apos;t load stories.{" "}
        {typeof error === "string" ? error : error?.message || "Unknown error"}
      </p>
    );
  }

  if (!posts.length) {
    return (
      <p className="text-sm text-neutral-500">
        {query
          ? "No stories match your search. Try different keywords."
          : "No stories yet. Check back soon."}
      </p>
    );
  }

  return (
    <div>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <Link
            href={buildHref(page - 1, query)}
            aria-disabled={page <= 1}
            className={`rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 ${
              page <= 1 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Previous
          </Link>
          <span className="px-2 text-sm text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <Link
            href={buildHref(page + 1, query)}
            aria-disabled={page >= totalPages}
            className={`rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 ${
              page >= totalPages ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Next
          </Link>
        </nav>
      )}
    </div>
  );
}
