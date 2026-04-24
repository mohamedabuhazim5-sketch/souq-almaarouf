import { supabase } from "../lib/supabase";

export async function getAllBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("GET BANNERS ERROR:", error);
    throw error;
  }

  return data || [];
}

export async function createBanner(payload) {
  const { data, error } = await supabase
    .from("banners")
    .insert({
      title_ar: payload.title_ar,
      subtitle_ar: payload.subtitle_ar || null,
      image_url: payload.image_url || null,
      button_text: payload.button_text || null,
      button_link: payload.button_link || null,
      sort_order: Number(payload.sort_order || 0),
      is_active: Boolean(payload.is_active),
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE BANNER ERROR:", error);
    throw error;
  }

  return data;
}

export async function updateBanner(bannerId, payload) {
  const { data, error } = await supabase
    .from("banners")
    .update({
      title_ar: payload.title_ar,
      subtitle_ar: payload.subtitle_ar || null,
      image_url: payload.image_url || null,
      button_text: payload.button_text || null,
      button_link: payload.button_link || null,
      sort_order: Number(payload.sort_order || 0),
      is_active: Boolean(payload.is_active),
    })
    .eq("id", bannerId)
    .select()
    .single();

  if (error) {
    console.error("UPDATE BANNER ERROR:", error);
    throw error;
  }

  return data;
}

export async function deleteBanner(bannerId) {
  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", bannerId);

  if (error) {
    console.error("DELETE BANNER ERROR:", error);
    throw error;
  }
}

export async function toggleBannerStatus(bannerId, isActive) {
  const { data, error } = await supabase
    .from("banners")
    .update({ is_active: !isActive })
    .eq("id", bannerId)
    .select()
    .single();

  if (error) {
    console.error("TOGGLE BANNER ERROR:", error);
    throw error;
  }

  return data;
}
