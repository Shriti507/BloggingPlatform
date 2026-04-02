"use client";

import { useState } from "react";
import { getInitialComments } from "@/lib/mockData";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState(() => getInitialComments(postId));
  const [body, setBody] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setComments((prev) => [
      {
        id: `local-${Date.now()}`,
        author: "You",
        body: text,
        at: "just now",
      },
      ...prev,
    ]);
    setBody("");
  }

  return (
    <section className="mt-16 border-t border-neutral-200 pt-10">
      <h2 className="font-serif text-2xl font-semibold text-neutral-900">Responses</h2>
      <p className="mt-1 text-sm text-neutral-500">Comments are stored in this session only (mock UI).</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <label htmlFor="comment" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="What are your thoughts?"
          className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-[#1a8917] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#157d14]"
          >
            Publish
          </button>
        </div>
      </form>

      <ul className="mt-10 space-y-6">
        {comments.length === 0 ? (
          <li className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-8 text-center text-sm text-neutral-500">
            No responses yet. Start the conversation.
          </li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="border-b border-neutral-100 pb-6 last:border-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-neutral-900">{c.author}</span>
                <span className="text-xs text-neutral-400">{c.at}</span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-700">{c.body}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
