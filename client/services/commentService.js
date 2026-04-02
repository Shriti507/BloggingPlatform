import { createClient } from "@/lib/supabase/server";
import { formatPostDate } from "@/lib/utils/posts";

/**
 * @param {string} postId
 */
export async function fetchCommentsForPost(postId) {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("comments")
    .select("id, body, created_at, user_id")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return { comments: [], error };

  const userIds = [...new Set((rows ?? []).map((r) => r.user_id).filter(Boolean))];
  let authorMap = {};
  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds);
    authorMap = Object.fromEntries((users ?? []).map((u) => [u.id, u.email]));
  }

  const comments = (rows ?? []).map((r) => {
    const email = authorMap[r.user_id] || "";
    const author = email.includes("@") ? email.split("@")[0] : email || "Reader";
    return {
      id: r.id,
      author,
      body: r.body ?? "",
      at: formatPostDate(r.created_at) || "recently",
    };
  });

  return { comments, error: null };
}
