import { supabase } from "../lib/supabase";

export async function loginAdmin(email, password) {
  const res = await supabase.auth.signInWithPassword({ email, password });
  if (res.error) throw res.error;
  return res.data;
}

export async function logoutAdmin() {
  const res = await supabase.auth.signOut();
  if (res.error) throw res.error;
}
