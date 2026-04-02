"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function CreatePostPage() {
  const { canWrite, isLoggedIn, hydrated } = useAuth();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (hydrated && isLoggedIn && !canWrite) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">Writing is limited</h1>
        <p className="mt-3 text-neutral-600">
          Your current role can read and comment, but only authors and admins can publish new posts in this
          preview.
        </p>
        <Link href="/" className="mt-8 inline-block font-medium text-[#1a8917] hover:underline">
          Back home
        </Link>
      </div>
    );
  }

  if (hydrated && !isLoggedIn) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">Sign in to write</h1>
        <p className="mt-3 text-neutral-600">Log in as an author or admin to use the editor (mock flow).</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-[#1a8917] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#157d14]"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-neutral-900">New story</h1>
        <p className="mt-2 text-sm text-neutral-500">Drafts save locally in a future version—this form is UI only.</p>
      </div>

      {submitted ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-6 py-10 text-center">
          <p className="font-medium text-emerald-900">Thanks! In production this would create a post.</p>
          <p className="mt-2 text-sm text-emerald-800/90">
            Title: {title || "(empty)"} — no data was sent.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 text-sm font-medium text-[#157d14] hover:underline"
          >
            Write another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-[15px] text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              placeholder="Give your story a title"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700">
              Cover image URL
            </label>
            <input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-[15px] text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              placeholder="https://images.unsplash.com/..."
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="mt-2 w-full resize-y rounded-lg border border-neutral-300 px-4 py-3 text-[15px] text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              placeholder="Tell your story..."
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[#1a8917] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#157d14]"
            >
              Publish (mock)
            </button>
            <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
