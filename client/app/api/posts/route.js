import { createClient } from "@/lib/supabase/server";
import { generatePostSummary } from "@/services/aiSummaryService";
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

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 403 });
    }

    if (profile.role !== "author" && profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const title = String(body.title ?? "").trim();
    const postBody = String(body.body ?? "").trim();
    const image_url = String(body.image_url ?? "").trim() || null;

    if (!title || !postBody) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const { data: post, error: insertError } = await supabase
      .from("posts")
      .insert({
        title,
        body: postBody,
        image_url,
        author_id: user.id,
        summary: null,
      })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    if (process.env.GOOGLE_AI_API_KEY) {
      try {
        const summary = await generatePostSummary(postBody);
        const { error: upErr } = await supabase
          .from("posts")
          .update({ summary })
          .eq("id", post.id);
        if (upErr) {
          console.error("Failed to save summary:", upErr);
        }
      } catch (e) {
        console.error("AI summary failed:", e);
      }
    }

    return NextResponse.json({ id: post.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
