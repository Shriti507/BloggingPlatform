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

    // Get counts
    const { count: userCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: postCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    const { count: commentCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      stats: [
        { label: "Total Posts", value: postCount ?? 0, color: "text-blue-600" },
        { label: "Active Users", value: userCount ?? 0, color: "text-emerald-600" },
        { label: "Total Comments", value: commentCount ?? 0, color: "text-amber-600" },
      ],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
