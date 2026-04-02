// // services/authService.js
// import { createClient } from "@/lib/supabase/client";
// import { normalizeRole } from "@/lib/auth/roleChecks";

// /**
//  * Sign in a user with email and password
//  * @param {{ email: string, password: string }} creds
//  * @returns {Promise<{ error: Error | null }>}
//  */
// export async function signInWithPassword({ email, password }) {
//   const supabase = createClient();
//   const { error } = await supabase.auth.signInWithPassword({ email, password });
//   return { error };
// }

// /**
//  * Sign up a new user and create their public profile record
//  * @param {{ email: string, password: string, fullName?: string, role?: string }} input
//  * @returns {Promise<{ error: Error | null, needsEmailConfirmation?: boolean }>}
//  */
// export async function signUpWithProfile({ email, password, fullName, role = "viewer" }) {
//   const supabase = createClient();
  
//   // 1. Normalize the role to ensure it matches the database CHECK constraint ('viewer', 'author', 'admin')
//   const normalizedRole = normalizeRole(role);
  
//   // 2. Sign up with Supabase Auth
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         // FIXED: Using 'fullName' correctly to avoid 'undefined' values in metadata
//         name: fullName || "User",   
//         role: normalizedRole
//       }
//     }
//   });

//   if (error) return { error };

//   const user = data.user;
//   if (!user) {
//     return { error: new Error("No user returned from signup") };
//   }

//   // 3. Manual sync to public.users table 
//   // Runs immediately if email confirmation is disabled (data.session exists)
//   if (data.session) {
//     const { error: upsertError } = await supabase.from("users").upsert({
//       id: user.id,
//       email: user.email ?? email,
//       name: fullName || "New User",
//       role: normalizedRole,
//       updated_at: new Date().toISOString(),
//     }, { 
//       onConflict: 'id'
//     });
    
//     if (upsertError) return { error: upsertError };
//   }

//   const needsEmailConfirmation = !data.session;
//   return { error: null, needsEmailConfirmation };
// }

// /**
//  * Sign out the current user
//  * @returns {Promise<{ error: Error | null }>}
//  */
// export async function signOut() {
//   const supabase = createClient();
//   const { error } = await supabase.auth.signOut();
//   return { error };
// }


import { createClient } from "@/lib/supabase/client";
import { normalizeRole } from "@/lib/auth/roleChecks";

export async function signInWithPassword({ email, password }) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}


  
export async function signUpWithProfile({ email, password, fullName, role = "viewer" }) {
  const supabase = createClient();
  const normalizedRole = normalizeRole(role);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: fullName || "User",   
        full_name: fullName || "User",
        role: normalizedRole
      }
    }
  });

  if (error) return { error };

  // DELETE or COMMENT OUT the manual upsert block here.
  // The database trigger you just updated in Step 1 handles this now.

  const needsEmailConfirmation = !data.session;
  return { error: null, needsEmailConfirmation };
}


export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}
