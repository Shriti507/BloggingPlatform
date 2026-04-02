"use client";

import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, isLoggedIn, isAdmin, canWrite, loading: authLoading } = useAuth();
  const [rows, setRows] = useState([]);
  const [listError, setListError] = useState("");
  const [loadingList, setLoadingList] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    try {
      const res = await fetch("/api/posts/mine");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setListError(data.error || "Could not load posts");
        setRows([]);
        setLoadingList(false);
        return;
      }
      setRows(data.rows ?? []);
    } catch {
      setListError("Network error");
      setRows([]);
    }
    setLoadingList(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadPosts();
  }, [isLoggedIn, loadPosts]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl flex-1 px-4 py-20 text-center text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          Your dashboard
        </h1>
        <p className="mt-3 text-neutral-600">Sign in to see your stories and settings.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Profile
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Signed in as <span className="font-medium text-neutral-800">{user.name}</span>
        {user.role && (
          <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {user.role}
          </span>
        )}
      </p>

      {isAdmin && (
        <section className="mt-10 rounded-lg border border-amber-200 bg-amber-50/80 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
            Admin
          </h2>
          <p className="mt-2 text-sm text-amber-950/90">
            You can edit any post and remove comments from post pages. Promote readers to authors
            by updating the <code className="rounded bg-amber-100/80 px-1">role</code> column in the{" "}
            <code className="rounded bg-amber-100/80 px-1">users</code> table in Supabase.
          </p>
          <p className="mt-3 text-sm text-amber-950/90">
            {canWrite
              ? "Below: all posts on the site."
              : "Below: all posts (admin view)."}
          </p>
        </section>
      )}

      {canWrite ? (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-neutral-900">
            {isAdmin ? "All posts" : "Your posts"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Open a story to read it, or edit from the post page.
          </p>

          {listError && (
            <p className="mt-4 text-sm text-red-600">{listError}</p>
          )}
          {loadingList ? (
            <p className="mt-6 text-sm text-neutral-500">Loading posts…</p>
          ) : (
            <ul className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
              {rows.length === 0 ? (
                <li className="p-4 text-sm text-neutral-500">No posts yet.</li>
              ) : (
                rows.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/post/${row.id}`}
                        className="font-medium text-neutral-900 transition hover:text-neutral-600"
                      >
                        {row.title}
                      </Link>
                      <p className="mt-1 text-xs text-neutral-500">
                        {row.status} · Updated {row.updatedAt}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/post/${row.id}/edit`}
                        className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                      >
                        Edit
                      </Link>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      ) : (
        <section className="mt-10 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-neutral-900">Reader account</h2>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            You can read stories and comment when signed in. To publish, an admin must set your
            role to <code className="rounded bg-neutral-100 px-1">author</code> in Supabase.
          </p>
        </section>
      )}
    </div>
  );
}
