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
          body: content,
          image_url: imageUrl || null,
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
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          Writing is for authors and admins
        </h1>
        <p className="mt-3 text-neutral-600">
          Your account has the reader role. Ask a project admin to set your role to{" "}
          <code className="rounded bg-neutral-100 px-1">author</code> in Supabase.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Back to profile
        </Link>
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
