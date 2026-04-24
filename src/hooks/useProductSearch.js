import { useMemo, useState } from "react";

export function useProductSearch(products) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((product) => {
      const name = String(product.name_ar || "").toLowerCase();
      const description = String(product.short_description || "").toLowerCase();
      return name.includes(keyword) || description.includes(keyword);
    });
  }, [products, search]);

  return { search, setSearch, filteredProducts };
}
