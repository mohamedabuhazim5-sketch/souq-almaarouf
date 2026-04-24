import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useStoreData() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStoreData() {
      setLoading(true);
      setError("");
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
        supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }),
      ]);

      if (categoriesRes.error || productsRes.error) {
        setError("حدث خطأ أثناء تحميل بيانات المتجر");
        setLoading(false);
        return;
      }

      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
      setLoading(false);
    }
    loadStoreData();
  }, []);

  return { categories, products, loading, error };
}
