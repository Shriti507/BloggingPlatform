import { createClient } from "@/lib/supabase/client";

/**
 * Ensures `public.users` has a row (e.g. email-confirmation signup before insert ran).
 * Does not overwrite existing roles.
 * @param {import("@supabase/supabase-js").User} authUser
 */
export async function ensurePublicUserRow(authUser) {
  const supabase = createClient();
  const { data: existing, error: selErr } = await supabase
    .from("users")
    .select("id")
    .eq("id", authUser.id)
    .maybeSingle();

  if (selErr) return { error: selErr };
  if (existing) return { error: null };

  const { error } = await supabase.from("users").insert({
    id: authUser.id,
    email: authUser.email ?? "",
    role: "viewer",
  });
  return { error };
}
