// test-role.js
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
);

async function checkRoles() {
  const { data, error } = await supabase.from('users').select('name, email, role');
  console.log("Users:", data);
  if (error) console.error("Error:", error);
}

checkRoles();
