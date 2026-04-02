import PostListSection from "@/components/PostListSection";
import { fetchPostsPaginated } from "@/services/postService";
import Link from "next/link";

const PAGE_SIZE = 6;

export default async function HomePage({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = Math.max(1, parseInt(String(sp.page || "1"), 10) || 1);

  const { posts, total, error } = await fetchPostsPaginated({
    q,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="flex-1">
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-[var(--surface-muted)]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Ideas worth exploring
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-600">
            Read thoughtful stories on design, writing, and building products—without the noise.
          </p>
          <Link
            href="/membership"
            className="mt-8 inline-flex rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Explore membership
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <label htmlFor="home-search" className="sr-only">
          Search stories
        </label>
        <form action="/" method="get" className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            id="home-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search by title or content"
            className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-12 pr-5 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
          />
        </form>

        <h2 className="mt-14 font-serif text-2xl font-semibold text-neutral-900">
          Latest
        </h2>
        <div className="mt-8">
          <PostListSection
            posts={posts}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            query={q}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
