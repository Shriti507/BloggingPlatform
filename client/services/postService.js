import { createClient } from "@/lib/supabase/server";
import { mapPostForCard, sanitizeSearchTerm } from "@/lib/utils/posts";

/**
 * @param {{ q?: string, page?: number, pageSize?: number }} opts
 */
export async function fetchPostsPaginated({ q, page = 1, pageSize = 6 }) {
  const supabase = await createClient();
  const term = sanitizeSearchTerm(q || "");
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (term) {
    const pattern = `%${term}%`;
    query = query.or(`title.ilike.${pattern},body.ilike.${pattern}`);
  }

  const { data: rows, error, count } = await query;

  if (error) {
    return { posts: [], total: 0, error: new Error(error.message || "Query failed") };
  }

  const list = rows ?? [];
  const authorIds = [...new Set(list.map((r) => r.author_id).filter(Boolean))];
  let authorMap = {};

  if (authorIds.length > 0) {
    const { data: authors } = await supabase
      .from("users")
      .select("id, email")
      .in("id", authorIds);
    authorMap = Object.fromEntries((authors ?? []).map((a) => [a.id, a.email]));
  }

  const posts = list.map((row) => mapPostForCard(row, authorMap[row.author_id]));

  return {
    posts,
    total: count ?? 0,
    error: null,
  };
}

/**
 * @param {string} id
 */
export async function fetchPostById(id) {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { post: null, error };
  }
  if (!row) {
    return { post: null, error: null };
  }

  let authorEmail = "";
  if (row.author_id) {
    const { data: author } = await supabase
      .from("users")
      .select("email")
      .eq("id", row.author_id)
      .maybeSingle();
    authorEmail = author?.email ?? "";
  }

  return { post: mapPostForCard(row, authorEmail), error: null };
}

/**
 * Dashboard: current user's posts, or all for admin
 * @param {{ userId: string, role: string }} opts
 */
export async function fetchDashboardPosts({ userId, role }) {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("id, title, created_at, updated_at, author_id")
    .order("updated_at", { ascending: false });

  if (role !== "admin") {
    query = query.eq("author_id", userId);
  }

  const { data, error } = await query;
  if (error) return { rows: [], error };

  return {
    rows: (data ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      status: "Published",
      updatedAt: r.updated_at
        ? new Date(r.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
    })),
    error: null,
  };
}
