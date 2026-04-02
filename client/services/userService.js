import { normalizeRole } from "@/lib/auth/roleChecks";

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 * @param {Record<string, unknown> | undefined} userMetadata
 */
export async function fetchUserProfile(supabase, userId, userMetadata) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return { profile: null, error };

  const metaName = userMetadata?.full_name;
  const email = data.email || "";
  const nameFromEmail = email.includes("@") ? email.split("@")[0] : email;

  const profile = {
    id: data.id,
    email,
    name:
      (typeof metaName === "string" && metaName.trim()) || nameFromEmail || "Member",
    role: normalizeRole(data.role),
  };

  return { profile, error: null };
}
