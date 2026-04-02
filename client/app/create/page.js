"use client";

import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreatePostPage() {
  const { user, canWrite, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user == null) {
      router.replace("/login");
    }
  }, [user, router, authLoading]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body: content, // keeping body to avoid breaking backend
          content: content, // appending content for strict compliance
          image_url: imageUrl || null,
          user: { id: user.id, role: user.role }
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not publish");
        setSubmitting(false);
        return;
      }
      if (data.id) {
        router.push(`/post/${data.id}`);
        router.refresh();
        return;
      }
      setError("Unexpected response");
    } catch {
      setError("Network error");
    }
    setSubmitting(false);
  }

  if (authLoading || (user == null && !authLoading)) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center sm:px-6">
        <p className="text-sm text-neutral-500">
          {user == null && !authLoading ? "Redirecting to login…" : "Loading…"}
        </p>
      </div>
    );
  }

  if (!canWrite) {
    return (
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="mt-6 font-serif text-2xl font-semibold text-neutral-900">
          Authors & Admins only
        </h1>
        <p className="mt-3 text-neutral-600">
          Your current role is <span className="font-bold text-neutral-900">{user?.role}</span>. 
          To start writing stories, you need to be an author.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/membership"
            className="rounded-full bg-neutral-900 px-8 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-neutral-800 hover:shadow-xl"
          >
            Upgrade to Author
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            Go back to reader view
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        New story
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        A short summary is generated once when you publish (if AI is configured).
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="create-title" className="block text-sm font-medium text-neutral-700">
            Title
          </label>
          <input
            id="create-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="Give your story a title"
          />
        </div>
        <div>
          <label htmlFor="create-image" className="block text-sm font-medium text-neutral-700">
            Cover image URL
          </label>
          <input
            id="create-image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="https://..."
          />
        </div>
        <div>
          <label htmlFor="create-content" className="block text-sm font-medium text-neutral-700">
            Content
          </label>
          <textarea
            id="create-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            required
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm leading-relaxed outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="Write your story..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {submitting ? "Publishing…" : "Publish"}
        </button>
      </form>
    </div>
  );
}
