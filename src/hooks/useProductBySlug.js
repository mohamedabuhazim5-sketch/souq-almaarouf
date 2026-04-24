import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useProductBySlug(slug) {
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const productRes = await supabase.from("products").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
      const product = productRes.data || null;
      setProduct(product);

      if (product) {
        const similarRes = await supabase
          .from("products")
          .select("*")
          .eq("category_id", product.category_id)
          .eq("is_active", true)
          .neq("id", product.id)
          .limit(4);
        setSimilarProducts(similarRes.data || []);
      } else {
        setSimilarProducts([]);
      }

      setLoading(false);
    }
    if (slug) loadProduct();
  }, [slug]);

  return { product, similarProducts, loading };
}
