"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreatePostPage() {
  const { user, canWrite } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user == null) {
      router.replace("/login");
    }
  }, [user, router]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (user == null) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center sm:px-6">
        <p className="text-sm text-neutral-500">Redirecting to login…</p>
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
          You&apos;re signed in as a reader. Sign out and log in again with the Author or Admin
          role to create posts (mock).
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Switch account (login)
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
        This form is UI-only; nothing is saved yet.
      </p>

      {submitted && (
        <div
          className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          Thanks—your draft would be submitted when the backend is connected.
        </div>
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
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Publish (mock)
        </button>
      </form>
    </div>
  );
}
