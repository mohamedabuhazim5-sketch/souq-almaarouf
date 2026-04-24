import { supabase } from "../lib/supabase";

export async function getActiveBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("GET ACTIVE BANNERS ERROR:", error);
    throw error;
  }

  return data || [];
}

export async function getActiveStoreFeatures() {
  const { data, error } = await supabase
    .from("store_features")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("GET ACTIVE STORE FEATURES ERROR:", error);
    throw error;
  }

  return data || [];
}
