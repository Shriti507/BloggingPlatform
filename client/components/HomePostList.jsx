"use client";

import { useMemo, useState } from "react";
import PostCard from "./PostCard";

const PAGE_SIZE = 3;

export default function HomePostList({ posts }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const slice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return posts.slice(start, start + PAGE_SIZE);
  }, [posts, page]);

  function goTo(p) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div>
      <ul className="space-y-8">
        {slice.map((post) => (
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
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 text-sm text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
