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

    const { data: rows, error: fetchError } = await supabase
      .from("comments")
      .select("id, body, created_at, user_id, post_id")
      .order("created_at", { ascending: false })
      .limit(50);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    const userIds = [...new Set((rows ?? []).map((r) => r.user_id).filter(Boolean))];
    const postIds = [...new Set((rows ?? []).map((r) => r.post_id).filter(Boolean))];

    let userMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, email").in("id", userIds);
      userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u.email]));
    }

    let postMap = {};
    if (postIds.length > 0) {
      const { data: posts } = await supabase.from("posts").select("id, title").in("id", postIds);
      postMap = Object.fromEntries((posts ?? []).map((p) => [p.id, p.title]));
    }

    const comments = (rows ?? []).map((r) => {
      const email = userMap[r.user_id] || "";
      let authorLabel = email.includes("@") ? email.split("@")[0] : email;
      if (!authorLabel) authorLabel = "Reader";

      return {
        id: r.id,
        author: authorLabel,
        postTitle: postMap[r.post_id] || "Unknown post",
        body: r.body || "",
        at: r.created_at ? new Date(r.created_at).toLocaleDateString() : "recently",
      };
    });

    return NextResponse.json({ comments });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
