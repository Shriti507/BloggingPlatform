"use client";

import { useAuth } from "@/components/AuthProvider";
import { getPostById, MOCK_MY_POSTS } from "@/lib/mockData";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const { user, isLoggedIn, isAdmin, canWrite } = useAuth();
  const [editingId, setEditingId] = useState(null);

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
          <ul className="mt-3 space-y-2 text-sm text-amber-950/90">
            <li>
              <button
                type="button"
                className="text-left underline-offset-2 hover:underline"
                onClick={() => alert("Moderation queue — UI placeholder")}
              >
                Open moderation queue (mock)
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-left underline-offset-2 hover:underline"
                onClick={() => alert("Site settings — UI placeholder")}
              >
                Site settings (mock)
              </button>
            </li>
          </ul>
        </section>
      )}

      {canWrite ? (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-neutral-900">Your posts</h2>
          <p className="mt-1 text-sm text-neutral-500">Dummy data; edit is UI-only.</p>

          <ul className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
            {MOCK_MY_POSTS.map((row) => (
              <li key={row.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  {getPostById(row.id) ? (
                    <Link
                      href={`/post/${row.id}`}
                      className="font-medium text-neutral-900 transition hover:text-neutral-600"
                    >
                      {row.title}
                    </Link>
                  ) : (
                    <span className="font-medium text-neutral-900">{row.title}</span>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">
                    {row.status} · Updated {row.updatedAt}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {editingId === row.id ? (
                    <button
                      type="button"
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                      onClick={() => setEditingId(null)}
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                      onClick={() => setEditingId(row.id)}
                    >
                      Edit (UI)
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mt-10 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-neutral-900">Reader account</h2>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            You can read stories and join discussions. To manage drafts and use Edit (UI), sign in
            with the Author or Admin role on the login page.
          </p>
        </section>
      )}
    </div>
  );
}
