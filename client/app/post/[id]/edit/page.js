"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data: row, error } = await supabase
        .from("posts")
        .select("id, title, body, image_url, author_id")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;
      if (error || !row) {
        setLoadError("Post not found.");
        setLoadingPost(false);
        return;
      }

      const canEdit = isAdmin || row.author_id === user.id;
      if (!canEdit) {
        setForbidden(true);
        setLoadingPost(false);
        return;
      }

      setTitle(row.title ?? "");
      setContent(row.body ?? "");
      setImageUrl(row.image_url ?? "");
      setLoadingPost(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, id, router, isAdmin]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body: content,
          image_url: imageUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(data.error || "Save failed");
        setSaving(false);
        return;
      }
      router.push(`/post/${id}`);
      router.refresh();
    } catch {
      setSaveError("Network error");
    }
    setSaving(false);
  }

  if (authLoading || loadingPost) {
    return (
      <div className="mx-auto max-w-2xl flex-1 px-4 py-20 text-center text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center">
        <h1 className="font-serif text-xl font-semibold text-neutral-900">Access denied</h1>
        <p className="mt-2 text-sm text-neutral-600">You can&apos;t edit this story.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-neutral-900 underline">
          Home
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center text-sm text-red-600">
        {loadError}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Edit story
      </h1>

      {saveError && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {saveError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-neutral-700">
            Title
          </label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
          />
        </div>
        <div>
          <label htmlFor="edit-image" className="block text-sm font-medium text-neutral-700">
            Cover image URL
          </label>
          <input
            id="edit-image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
          />
        </div>
        <div>
          <label htmlFor="edit-content" className="block text-sm font-medium text-neutral-700">
            Content
          </label>
          <textarea
            id="edit-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            required
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm leading-relaxed outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
