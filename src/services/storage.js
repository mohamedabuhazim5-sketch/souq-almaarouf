import { supabase } from "../lib/supabase";

export async function uploadProductImage(file) {
  const safeName = `${Date.now()}-${file.name.toLowerCase().split(" ").join("-")}`;
  const uploadRes = await supabase.storage.from("products").upload(safeName, file, { upsert: true });
  if (uploadRes.error) throw uploadRes.error;
  const publicRes = supabase.storage.from("products").getPublicUrl(safeName);
  return publicRes.data.publicUrl;
}
