import { isAdminRole } from "@/lib/auth/roleChecks";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!isAdminRole(profile?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get recent comments across all posts
    const { data: rows, error: fetchError } = await supabase
      .from("comments")
      .select(`
        id,
        body,
        created_at,
        user_id,
        post_id,
        posts (title)
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    const userIds = [...new Set((rows ?? []).map((r) => r.user_id).filter(Boolean))];
    let authorMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id, email")
        .in("id", userIds);
      authorMap = Object.fromEntries((users ?? []).map((u) => [u.id, u.email]));
    }

    const comments = (rows ?? []).map((r) => ({
      id: r.id,
      body: r.body,
      at: new Date(r.created_at).toLocaleString(),
      author: authorMap[r.user_id] || "Unknown",
      postTitle: r.posts?.title || "Deleted Post",
    }));

    return NextResponse.json({ comments });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
