import { supabase } from "../lib/supabase";

export async function getStoreSettings() {
  const res = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  if (res.error) throw res.error;
  return res.data;
}

export async function upsertStoreSettings(payload) {
  const existing = await getStoreSettings();

  if (existing?.id) {
    const res = await supabase
      .from("store_settings")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (res.error) throw res.error;
    return res.data;
  }

  const res = await supabase.from("store_settings").insert(payload).select().single();
  if (res.error) throw res.error;
  return res.data;
}
