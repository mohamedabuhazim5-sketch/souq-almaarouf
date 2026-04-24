import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (cartItem) =>
              cartItem.productId === item.productId &&
              cartItem.weightLabel === item.weightLabel
          );

          if (existingIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + 1,
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      updateQuantity: (productId, weightLabel, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.weightLabel === weightLabel
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      removeItem: (productId, weightLabel) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.weightLabel === weightLabel)
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "souq-almaarouf-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
