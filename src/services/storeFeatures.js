import { supabase } from "../lib/supabase";

export async function getAllStoreFeatures() {
  const { data, error } = await supabase
    .from("store_features")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("GET STORE FEATURES ERROR:", error);
    throw error;
  }

  return data || [];
}

export async function createStoreFeature(payload) {
  const { data, error } = await supabase
    .from("store_features")
    .insert({
      title_ar: payload.title_ar,
      description_ar: payload.description_ar || null,
      icon_name: payload.icon_name || null,
      sort_order: Number(payload.sort_order || 0),
      is_active: Boolean(payload.is_active),
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE STORE FEATURE ERROR:", error);
    throw error;
  }

  return data;
}

export async function updateStoreFeature(featureId, payload) {
  const { data, error } = await supabase
    .from("store_features")
    .update({
      title_ar: payload.title_ar,
      description_ar: payload.description_ar || null,
      icon_name: payload.icon_name || null,
      sort_order: Number(payload.sort_order || 0),
      is_active: Boolean(payload.is_active),
    })
    .eq("id", featureId)
    .select()
    .single();

  if (error) {
    console.error("UPDATE STORE FEATURE ERROR:", error);
    throw error;
  }

  return data;
}

export async function deleteStoreFeature(featureId) {
  const { error } = await supabase
    .from("store_features")
    .delete()
    .eq("id", featureId);

  if (error) {
    console.error("DELETE STORE FEATURE ERROR:", error);
    throw error;
  }
}

export async function toggleStoreFeatureStatus(featureId, isActive) {
  const { data, error } = await supabase
    .from("store_features")
    .update({ is_active: !isActive })
    .eq("id", featureId)
    .select()
    .single();

  if (error) {
    console.error("TOGGLE STORE FEATURE ERROR:", error);
    throw error;
  }

  return data;
}
