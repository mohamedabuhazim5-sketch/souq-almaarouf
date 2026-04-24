import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useCategoryBySlug(slug) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      setLoading(true);
      const categoryRes = await supabase.from("categories").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
      const category = categoryRes.data || null;
      setCategory(category);

      if (category) {
        const productsRes = await supabase
          .from("products")
          .select("*")
          .eq("category_id", category.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        setProducts(productsRes.data || []);
      } else {
        setProducts([]);
      }

      setLoading(false);
    }
    if (slug) loadCategory();
  }, [slug]);

  return { category, products, loading };
}
