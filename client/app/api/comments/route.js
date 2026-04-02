import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const post_id = String(body.post_id ?? "").trim();
    const text = String(body.body ?? "").trim();

    if (!post_id || !text) {
      return NextResponse.json(
        { error: "post_id and body are required" },
        { status: 400 }
      );
    }

    const { data: post } = await supabase
      .from("posts")
      .select("id")
      .eq("id", post_id)
      .maybeSingle();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { data: row, error: insertError } = await supabase
      .from("comments")
      .insert({
        post_id,
        user_id: user.id,
        body: text,
      })
      .select("id, body, created_at, user_id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    const { data: author } = await supabase
      .from("users")
      .select("email")
      .eq("id", user.id)
      .maybeSingle();

    const email = author?.email ?? "";
    const authorLabel = email.includes("@") ? email.split("@")[0] : email || "You";

    return NextResponse.json({
      comment: {
        id: row.id,
        author: authorLabel,
        body: row.body,
        at: row.created_at
          ? new Date(row.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "just now",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
