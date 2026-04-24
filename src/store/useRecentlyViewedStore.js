import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],
      addViewedProduct: (product) => {
        const current = get().items || [];
        const normalized = {
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
          oldPrice: product.oldPrice ?? null,
          weightLabel: product.weightLabel,
        };

        const deduped = current.filter((item) => item.id !== normalized.id);
        set({ items: [normalized, ...deduped].slice(0, 8) });
      },
      clearRecentlyViewed: () => set({ items: [] }),
    }),
    {
      name: "souq-almaarouf-recently-viewed",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
