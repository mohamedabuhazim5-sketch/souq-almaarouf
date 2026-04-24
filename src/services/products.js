import { supabase } from "../lib/supabase";

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET PRODUCTS ERROR:", error);
    throw error;
  }

  return data || [];
}

export async function getProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    throw error;
  }

  return data;
}

export async function createProduct(payload) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: payload.category_id || null,
      name_ar: payload.name_ar,
      slug: payload.slug,
      short_description: payload.short_description || null,
      long_description: payload.long_description || null,
      image_url: payload.image_url || null,
      sku: payload.sku || null,
      unit_label: payload.unit_label || "كجم",
      weight_value: Number(payload.weight_value || 1),
      price: Number(payload.price || 0),
      sale_price:
        payload.sale_price === "" || payload.sale_price == null
          ? null
          : Number(payload.sale_price),
      min_order_qty: Number(payload.min_order_qty || 1),
      max_order_qty:
        payload.max_order_qty === "" || payload.max_order_qty == null
          ? null
          : Number(payload.max_order_qty),
      stock_qty: Number(payload.stock_qty || 0),
      low_stock_threshold: Number(payload.low_stock_threshold || 5),
      is_featured: Boolean(payload.is_featured),
      is_best_seller: Boolean(payload.is_best_seller),
      is_active: Boolean(payload.is_active),
      meta_title: payload.meta_title || null,
      meta_description: payload.meta_description || null,
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    throw error;
  }

  return data;
}

export async function updateProduct(productId, payload) {
  const { data, error } = await supabase
    .from("products")
    .update({
      category_id: payload.category_id || null,
      name_ar: payload.name_ar,
      slug: payload.slug,
      short_description: payload.short_description || null,
      long_description: payload.long_description || null,
      image_url: payload.image_url || null,
      sku: payload.sku || null,
      unit_label: payload.unit_label || "كجم",
      weight_value: Number(payload.weight_value || 1),
      price: Number(payload.price || 0),
      sale_price:
        payload.sale_price === "" || payload.sale_price == null
          ? null
          : Number(payload.sale_price),
      min_order_qty: Number(payload.min_order_qty || 1),
      max_order_qty:
        payload.max_order_qty === "" || payload.max_order_qty == null
          ? null
          : Number(payload.max_order_qty),
      stock_qty: Number(payload.stock_qty || 0),
      low_stock_threshold: Number(payload.low_stock_threshold || 5),
      is_featured: Boolean(payload.is_featured),
      is_best_seller: Boolean(payload.is_best_seller),
      is_active: Boolean(payload.is_active),
      meta_title: payload.meta_title || null,
      meta_description: payload.meta_description || null,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    throw error;
  }

  return data;
}

export async function deleteProduct(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    throw error;
  }
}
