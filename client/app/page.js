import Link from "next/link";
import PostListSection from "@/components/PostListSection";
import { fetchPostsPaginated } from "@/services/postService";

const PAGE_SIZE = 6;

export default async function Page({ searchParams }) {
  const sp = (await searchParams) || {};

  const q = typeof sp.q === "string" ? sp.q : "";
  const page = Math.max(1, parseInt(String(sp.page || "1"), 10) || 1);

  const { posts, total, error } = await fetchPostsPaginated({
    q,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-4xl font-semibold">Ideas worth exploring</h1>
          <p className="mt-4 text-neutral-600">Discover insightful articles, connect with creative minds, and stay inspired every day.</p>

          <Link
            href="/membership"
            className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-full"
          >
            Explore membership
          </Link>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <input
          type="search"
          placeholder="Search..."
          defaultValue={q}
          className="w-full border p-3 rounded-full"
        />

        <h2 className="mt-10 text-2xl font-semibold">Latest</h2>

        <div className="mt-6">
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
