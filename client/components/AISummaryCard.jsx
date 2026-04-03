"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * status: "loading" | "success" | "error"
 * summary: string (pre-generated, passed as prop)
 * onRetry: () => void
 */
export default function AISummaryCard({ summary, status = "success", onRetry }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const synthRef = useRef(null);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [summary, status]);

  // Parse summary into bullet points
  const bullets = parseSummaryBullets(summary);

  // Copy summary to clipboard
  const handleCopy = useCallback(async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = summary;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [summary]);

  // Share summary
  const handleShare = useCallback(async () => {
    if (!summary) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Summary",
          text: summary,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      // Fallback: copy link
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [summary]);

  // Text-to-speech
  const handleListen = useCallback(() => {
    if (!summary) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [summary, speaking]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div
      id="ai-summary-card"
      className="group/card relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-gradient-to-br from-neutral-50 via-white to-stone-50 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* Subtle gradient accent bar */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-400 via-indigo-400 to-sky-400 opacity-80" />

      {/* Header — always visible */}
      <button
        id="ai-summary-toggle"
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-neutral-50/50 sm:px-6"
      >
        <div className="flex items-center gap-3">
          {/* Sparkle icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
              AI Summary
            </span>
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
              AI-generated
            </span>
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-300 ease-out ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Collapsible content */}
      <div
        className="transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
        style={{
          maxHeight: expanded ? `${contentHeight + 80}px` : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="border-t border-neutral-100 px-5 pb-5 pt-4 sm:px-6">
          {/* Loading state */}
          {status === "loading" && (
            <div id="ai-summary-loading" className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <LoadingSpinner />
                <span className="animate-pulse">Generating summary…</span>
              </div>
              <div className="space-y-2.5">
                <SkeletonLine width="94%" />
                <SkeletonLine width="88%" />
                <SkeletonLine width="76%" />
                <SkeletonLine width="82%" />
              </div>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div id="ai-summary-error" className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50">
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">
                  Couldn&apos;t generate summary
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Something went wrong while processing this article.
                </p>
                {onRetry && (
                  <button
                    id="ai-summary-retry"
                    type="button"
                    onClick={onRetry}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md active:scale-[0.97]"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    Retry
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success state */}
          {status === "success" && bullets.length > 0 && (
            <>
              <ul id="ai-summary-bullets" className="space-y-2.5">
                {bullets.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Action buttons */}
              <div className="mt-5 flex items-center gap-1 border-t border-neutral-100 pt-4">
                <ActionButton
                  id="ai-summary-copy"
                  label={copied ? "Copied!" : "Copy"}
                  active={copied}
                  onClick={handleCopy}
                  icon={
                    copied ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    )
                  }
                />

                <ActionButton
                  id="ai-summary-share"
                  label="Share"
                  onClick={handleShare}
                  icon={
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                  }
                />

                <ActionButton
                  id="ai-summary-listen"
                  label={speaking ? "Stop" : "Listen"}
                  active={speaking}
                  onClick={handleListen}
                  icon={
                    speaking ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                      </svg>
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function ActionButton({ id, label, icon, onClick, active = false }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.96] ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SkeletonLine({ width = "100%" }) {
  return (
    <div
      className="h-3 animate-pulse rounded-full bg-neutral-200/70"
      style={{ width }}
    />
  );
}

function LoadingSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/* ─── Utilities ─── */

/**
 * Parse a summary string into 3-5 bullet points.
 * Handles: numbered lists, dash/bullet lists, or plain prose (sentence-split).
 */
function parseSummaryBullets(summary) {
  if (!summary || typeof summary !== "string") return [];

  const trimmed = summary.trim();
  if (!trimmed) return [];

  // Try numbered or bullet list first
  const listPattern = /^[\s]*(?:[-•*]|\d+[.)]\s)/m;
  if (listPattern.test(trimmed)) {
    const lines = trimmed
      .split(/\n/)
      .map((l) => l.replace(/^[\s]*(?:[-•*]|\d+[.)]\s*)\s*/, "").trim())
      .filter((l) => l.length > 0);
    if (lines.length >= 2) return lines.slice(0, 5);
  }

  // Fallback: split prose into sentences and pick 3-5
  const sentences = trimmed
    .replace(/([.!?])\s+/g, "$1|||")
    .split("|||")
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  if (sentences.length <= 5) return sentences;
  // Pick evenly spaced sentences
  const step = Math.floor(sentences.length / 4);
  return [
    sentences[0],
    sentences[step],
    sentences[step * 2],
    sentences[step * 3],
    sentences[sentences.length - 1],
  ].filter((s, i, arr) => arr.indexOf(s) === i);
}
