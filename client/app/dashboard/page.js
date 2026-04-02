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
        Signed in as <span className="font-medium text-neutral-800">{user?.name || "User"}</span>
        {user?.role && (
          <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {user.role}
          </span>
        )}
      </p>

      {isAdmin && (
        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-900">
              Administrative access
            </h2>
            <Link
              href="/admin"
              className="rounded-full bg-amber-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-800"
            >
              Open Admin Console
            </Link>
          </div>
          <p className="mt-3 text-sm text-amber-950/80 leading-relaxed">
            As an administrator, you have full access to platform-wide statistics, 
            post management, and comment moderation.
          </p>
        </section>
      )}

      {canWrite ? (
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-neutral-900">
                Your stories
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Manage and edit your published content.
              </p>
            </div>
            <Link
              href="/create"
              className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Write new story
            </Link>
          </div>

          {listError && (
            <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-100">
              {listError}
            </p>
          )}
          
          {loadingList ? (
            <div className="mt-8 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-neutral-100" />
              ))}
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <ul className="divide-y divide-neutral-100">
                {rows.length === 0 ? (
                  <li className="p-10 text-center">
                    <p className="text-sm text-neutral-500">You haven't written any stories yet.</p>
                    <Link href="/create" className="mt-3 inline-block text-sm font-semibold text-neutral-900 underline underline-offset-4">
                      Start your first draft
                    </Link>
                  </li>
                ) : (
                  rows.map((row) => (
                    <li
                      key={row.id}
                      className="group flex flex-col gap-4 p-5 transition-colors hover:bg-neutral-50/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/post/${row.id}`}
                          className="block text-lg font-medium text-neutral-900 transition group-hover:text-neutral-600"
                        >
                          {row.title}
                        </Link>
                        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                          <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
                            {row.status}
                          </span>
                          <span>·</span>
                          <span>Updated {row.updatedAt}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-3">
                        <Link
                          href={`/post/${row.id}/edit`}
                          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:shadow-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="bg-neutral-900 p-8 text-white">
            <h2 className="font-serif text-2xl font-semibold">Reader account</h2>
            <p className="mt-3 text-neutral-300 leading-relaxed max-w-lg">
              Welcome to the community. You can currently read stories and participate 
              in the discussion by leaving comments.
            </p>
          </div>
          <div className="p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
              Explore your features
            </h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-neutral-100 p-1">
                  <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Post Comments</p>
                  <p className="text-sm text-neutral-500">Share your thoughts on any story.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-neutral-100 p-1">
                  <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Personalized Feed</p>
                  <p className="text-sm text-neutral-500">Read stories from your favorite authors.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
