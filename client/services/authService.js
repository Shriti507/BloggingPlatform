import { createClient } from "@/lib/supabase/client";

/**
 * @param {{ email: string, password: string }} creds
 * @returns {{ error: Error | null }}
 */
export async function signInWithPassword({ email, password }) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

/**
 * @param {{ email: string, password: string, fullName?: string }} input
 * @returns {{ error: Error | null, needsEmailConfirmation?: boolean }}
 */
export async function signUpWithProfile({ email, password, fullName }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
    },
  });

  if (error) return { error };

  const user = data.user;
  if (!user) {
    return { error: new Error("No user returned from signup") };
  }

  if (data.session) {
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email ?? email,
      role: "viewer",
    });
    if (insertError && insertError.code !== "23505") {
      return { error: insertError };
    }
  }

  const needsEmailConfirmation = !data.session;
  return { error: null, needsEmailConfirmation };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}
