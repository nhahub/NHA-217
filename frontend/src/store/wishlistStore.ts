import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  toggleItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => set((state) => ({ items: [...state.items, id] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
      hasItem: (id) => get().items.includes(id),
      toggleItem: (id) => {
        const { items } = get();
        if (items.includes(id)) {
          set({ items: items.filter((i) => i !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
