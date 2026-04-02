"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import { MOCK_POSTS } from "@/lib/mockData";

const PAGE_SIZE = 3;

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_POSTS;
    return MOCK_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const sliceStart = (safePage - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(sliceStart, sliceStart + PAGE_SIZE);

  return (
    <div className="flex-1 bg-[#fafafa]">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Ideas worth exploring
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-600">
            Independent voices, long reads, and thoughtful takes—without the noise.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-[#1a8917] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#157d14]"
            >
              Get started
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Search stories
          </label>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search stories..."
            className="w-full rounded-full border border-neutral-300 bg-white py-3 pl-12 pr-4 text-[15px] text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="mt-10 space-y-8">
          {pagePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {pagePosts.length === 0 && (
            <p className="rounded-lg border border-dashed border-neutral-200 bg-white py-12 text-center text-neutral-500">
              No stories match your search.
            </p>
          )}
        </div>

        {filtered.length > PAGE_SIZE && (
          <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Pagination"
          >
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors enabled:hover:border-neutral-900 enabled:hover:bg-neutral-900 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-3 text-sm text-neutral-600">
              Page <span className="font-medium text-neutral-900">{safePage}</span> of{" "}
              <span className="font-medium text-neutral-900">{totalPages}</span>
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors enabled:hover:border-neutral-900 enabled:hover:bg-neutral-900 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
