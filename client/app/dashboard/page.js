"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { MOCK_MY_POSTS } from "@/lib/mockData";

export default function DashboardPage() {
  const { user, isLoggedIn, hydrated, isAdmin } = useAuth();
  const [banner, setBanner] = useState(null);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl flex-1 px-4 py-20">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">Your workspace</h1>
        <p className="mt-3 text-neutral-600">Sign in to view your posts and settings.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-[#1a8917] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#157d14]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-neutral-200 pb-8">
        <h1 className="font-serif text-3xl font-semibold text-neutral-900">Profile</h1>
        <p className="mt-2 text-neutral-600">
          <span className="font-medium text-neutral-800">{user?.displayName}</span>
          <span className="mx-2 text-neutral-300">·</span>
          {user?.email}
          <span className="mx-2 text-neutral-300">·</span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
            {user?.role}
          </span>
        </p>
      </div>

      {isAdmin && (
        <section className="mt-10 rounded-lg border border-amber-200/80 bg-amber-50/60 px-5 py-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900/90">Admin</h2>
          <p className="mt-2 text-sm text-amber-900/80">
            Extra controls will live here (moderation, users, site settings). UI placeholder only.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-amber-800/30 bg-white px-4 py-2 text-xs font-medium text-amber-950 transition-colors hover:bg-amber-100/80"
              onClick={() => setBanner("Review queue (mock)")}
            >
              Open review queue
            </button>
            <button
              type="button"
              className="rounded-full border border-amber-800/30 bg-white px-4 py-2 text-xs font-medium text-amber-950 transition-colors hover:bg-amber-100/80"
              onClick={() => setBanner("Export reports (mock)")}
            >
              Export reports
            </button>
          </div>
        </section>
      )}

      {banner && (
        <p className="mt-4 rounded-md bg-neutral-100 px-4 py-2 text-sm text-neutral-700" role="status">
          {banner}
        </p>
      )}

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-xl font-semibold text-neutral-900">Your stories</h2>
          <Link href="/create" className="text-sm font-medium text-[#1a8917] hover:underline">
            New story
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-500">Dummy list for layout—persistence comes later.</p>

        <ul className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          {MOCK_MY_POSTS.map((row) => (
            <li key={row.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  href={row.status === "Draft" ? "#" : `/post/${row.id}`}
                  className="font-medium text-neutral-900 hover:text-[#1a8917]"
                >
                  {row.title}
                </Link>
                <p className="mt-1 text-xs text-neutral-500">
                  Updated {row.updatedAt}
                  <span className="mx-2">·</span>
                  <span
                    className={
                      row.status === "Published"
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }
                  >
                    {row.status}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  onClick={() => setBanner(`Edit “${row.title}” (mock)`)}
                >
                  Edit
                </button>
                {row.status === "Published" ? (
                  <Link
                    href={`/post/${row.id}`}
                    className="rounded-full border border-transparent px-4 py-1.5 text-sm font-medium text-[#1a8917] hover:underline"
                  >
                    View
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
