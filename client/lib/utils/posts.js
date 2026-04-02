const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80";

export function estimateReadMinutes(body) {
  if (!body || typeof body !== "string") return 1;
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPostDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/** Map DB row + author email → PostCard / detail shape */
export function mapPostForCard(row, authorEmail) {
  const email = authorEmail || "";
  const authorLabel = email.includes("@") ? email.split("@")[0] : email || "Author";
  const summary =
    row.summary?.trim() ||
    (row.body ? `${row.body.slice(0, 180).trim()}${row.body.length > 180 ? "…" : ""}` : "");

  return {
    id: row.id,
    title: row.title ?? "",
    summary,
    author: authorLabel,
    imageUrl: row.image_url?.trim() || DEFAULT_COVER,
    publishedAt: formatPostDate(row.created_at),
    readMinutes: estimateReadMinutes(row.body),
    body: row.body ?? "",
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Strip chars that break PostgREST `.or()` / `ilike` filters */
export function sanitizeSearchTerm(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw.replace(/[%_,\\"]/g, "").trim();
}
