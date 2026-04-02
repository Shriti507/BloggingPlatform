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

    let query = supabase
      .from("posts")
      .select("id, title, created_at, updated_at, author_id")
      .order("updated_at", { ascending: false });

    if (!isAdminRole(profile?.role)) {
      query = query.eq("author_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const rows = (data ?? []).map((r) => ({
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
    }));

    return NextResponse.json({ rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
