import { canCreatePosts } from "@/lib/auth/roleChecks";
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

    // STEP A: Validate user role (Only "author" and "admin" can create posts)
    if (!canCreatePosts(profile.role)) {
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
    
    // Rigorous nullification to prevent literal `"null"` array injections or empty strings
    let parsedImage = body.image_url === null ? null : String(body.image_url ?? "").trim();
    if (parsedImage === "" || parsedImage === "null" || parsedImage === "undefined") {
      parsedImage = null;
    }
    const image_url = parsedImage;

    if (!title || !postBody) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    // STEP B & C: Call AI Summary Service Module & Receive summary response
    let summary = "Summary not available";
    try {
      // Calling logic natively directly prevents local dev server connection deadlocks!
      const generated = await generatePostSummary(postBody);
      if (generated) {
        summary = generated;
      }
    } catch (err) {
      console.error("Internal AI fetch failed:", err);
      // Fallback summary is retained
    }

    // STEP D: Store in database (Supabase) ONE-SHOT
    const { data: post, error: insertError } = await supabase
      .from("posts")
      .insert({
        title,
        body: postBody,
        image_url,
        author_id: user.id,
        summary,  // <- IMPORTANT
      })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    // STEP E: Return response to frontend
    return NextResponse.json({ id: post.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(searchParams.get("limit") || "10", 10) || 10;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select("id, title, summary, image_url, created_at, author_id, body", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      const escaped = search.replace(/[%_,\\"]/g, "");
      const pattern = `%${escaped}%`;
      query = query.or(`title.ilike.${pattern},body.ilike.${pattern}`);
    }

    const { data: posts, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: posts,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
