"use client";

import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

export default function CommentSection({
  postId,
  initialComments = [],
  isLoggedIn,
  isAdmin,
  loadError,
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, body: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not publish comment");
        setSubmitting(false);
        return;
      }
      if (data.comment) {
        setComments((prev) => [...prev, data.comment]);
      }
      setBody("");
    } catch {
      setError("Network error");
    }
    setSubmitting(false);
  }

  async function handleDelete(commentId) {
    setDeletingId(commentId);
    setError("");
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not delete");
        setDeletingId(null);
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Network error");
    }
    setDeletingId(null);
  }

  const showForm = isLoggedIn && Boolean(user);

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10">
      <h2 className="font-serif text-2xl font-semibold text-neutral-900">
        Responses
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        {showForm
          ? "Signed-in readers can respond."
          : "Sign in to leave a comment."}
      </p>

      {loadError && (
        <p className="mt-4 text-sm text-red-600">
          Comments could not be loaded. Refresh to try again.
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="comment-body" className="sr-only">
              Comment
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="What are your thoughts?"
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm leading-relaxed outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {submitting ? "Publishing…" : "Publish"}
          </button>
        </form>
      ) : null}

      <ul className="mt-10 space-y-6">
        {comments.length === 0 ? (
          <li className="text-sm text-neutral-500">No responses yet.</li>
        ) : (
          comments.map((c) => (
            <li
              key={c.id}
              className="border-b border-neutral-100 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {c.author}
                  </span>
                  <span className="text-xs text-neutral-400">{c.at}</span>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === c.id ? "Removing…" : "Remove"}
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                {c.body}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
