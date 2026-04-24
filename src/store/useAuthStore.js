import { create } from "zustand";

export const useAuthStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  login: (admin) => set({ admin, isAuthenticated: true }),
  logout: () => set({ admin: null, isAuthenticated: false }),
}));
