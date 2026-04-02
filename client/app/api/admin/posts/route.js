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

    // Get all posts for admin view
    const { data: rows, error: fetchError } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        created_at,
        updated_at,
        author_id,
        users (email)
      `)
      .order("updated_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    const posts = (rows ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      author: r.users?.email || "Unknown",
      updatedAt: new Date(r.updated_at || r.created_at).toLocaleDateString(),
    }));

    return NextResponse.json({ posts });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
