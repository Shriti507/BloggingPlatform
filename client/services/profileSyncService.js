import { createClient } from "@/lib/supabase/client";
import { normalizeRole } from "@/lib/auth/roleChecks";

/**
 * Ensures `public.users` has a row (e.g. email-confirmation signup before insert ran).
 * Does not overwrite existing roles.
 * @param {import("@supabase/supabase-js").User} authUser
 */
export async function ensurePublicUserRow(authUser) {
  const supabase = createClient();
  
  const { error } = await supabase.from("users").upsert({
    id: authUser.id,
    email: authUser.email ?? "",
    name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || "New User",
    role: normalizeRole(authUser.user_metadata?.role),
    updated_at: new Date().toISOString(),
  }, { 
    onConflict: 'id'
  });

  return { error };
}
