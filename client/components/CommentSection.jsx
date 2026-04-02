"use client";

import { useState } from "react";
import { getInitialComments } from "@/lib/mockData";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState(() =>
    getInitialComments(postId).map((c) => ({ ...c }))
  );
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("You");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        author: authorName.trim() || "You",
        body: trimmed,
        at: "just now",
      },
    ]);
    setBody("");
  }

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10">
      <h2 className="font-serif text-2xl font-semibold text-neutral-900">
        Responses
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        Comments are stored in the page only (mock UI).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="comment-name" className="sr-only">
            Display name
          </label>
          <input
            id="comment-name"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="w-full max-w-xs rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
          />
        </div>
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
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Publish
        </button>
      </form>

      <ul className="mt-10 space-y-6">
        {comments.length === 0 ? (
          <li className="text-sm text-neutral-500">No responses yet.</li>
        ) : (
          comments.map((c) => (
            <li
              key={c.id}
              className="border-b border-neutral-100 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-medium text-neutral-900">
                  {c.author}
                </span>
                <span className="text-xs text-neutral-400">{c.at}</span>
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
