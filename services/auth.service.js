// src/services/auth.service.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getUserFromAccess(accessToken) {
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) throw error;
  return data.user;
}
