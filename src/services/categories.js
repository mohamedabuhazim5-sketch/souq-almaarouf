import { supabase } from "../lib/supabase";

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("GET CATEGORIES ERROR:", error);
    throw error;
  }

  return data || [];
}

export async function createCategory(payload) {
  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    throw error;
  }

  return data;
}

export async function updateCategory(categoryId, payload) {
  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    throw error;
  }

  return data;
}

export async function deleteCategory(categoryId) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    throw error;
  }
}
