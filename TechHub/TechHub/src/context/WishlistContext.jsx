import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
  fetchWishlist,
  addWishlistItem,
  removeWishlistItem,
  syncWishlistItems,
} from '../api/wishlist';

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'wishlist';

const safeParse = (value) => {
  try {
    return JSON.parse(value) || [];
  } catch (error) {
    console.error('Failed to parse wishlist from storage:', error);
    return [];
  }
};

const normalizeWishlistItem = (product) => {
  if (!product) return null;
  const id = product._id || product.id;
  if (!id) return null;

  return {
    id,
    _id: id,
    name: product.name,
    price: product.price || 0,
    image: product.image || product.images?.[0] || null,
    stock: product.stock,
    slug: product.slug,
    description: product.description,
  };
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return safeParse(stored);
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let isMounted = true;

    const bootstrapWishlist = async () => {
      if (!isAuthenticated) {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored && isMounted) {
          setItems(safeParse(stored));
        }
        return;
      }

      setLoading(true);
      try {
        const storedItems = safeParse(localStorage.getItem(WISHLIST_STORAGE_KEY));
        let syncedItems = [];

        if (storedItems.length > 0) {
          syncedItems = await syncWishlistItems(storedItems.map((item) => item.id));
        } else {
          syncedItems = await fetchWishlist();
        }

        if (isMounted) {
          setItems(syncedItems);
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(syncedItems));
        }
      } catch (error) {
        console.error('Failed to load wishlist', error);
        toast.error(error.message || 'Unable to load wishlist');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrapWishlist();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const addToWishlist = async (product) => {
    const normalized = normalizeWishlistItem(product);
    if (!normalized) {
      toast.error('Unable to add this product to wishlist.');
      return;
    }

    if (isAuthenticated) {
      setLoading(true);
      try {
        const updated = await addWishlistItem(normalized.id);
        setItems(updated);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
        toast.success(`${normalized.name} added to wishlist`);
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Failed to update wishlist');
      } finally {
        setLoading(false);
      }
      return;
    }

    setItems((prev) => {
      if (prev.some((item) => item.id === normalized.id)) {
        toast('Product is already in your wishlist');
        return prev;
      }
      toast.success(`${normalized.name} added to wishlist`);
      return [...prev, normalized];
    });
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const updated = await removeWishlistItem(productId);
        setItems(updated);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
        toast.success('Removed from wishlist');
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Failed to remove item');
      } finally {
        setLoading(false);
      }
      return;
    }

    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      if (updated.length !== prev.length) {
        toast.success('Removed from wishlist');
      }
      return updated;
    });
  };

  const clearWishlist = async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const cleared = await syncWishlistItems([]);
        setItems(cleared);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(cleared));
        toast.success('Wishlist cleared');
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Failed to clear wishlist');
      } finally {
        setLoading(false);
      }
      return;
    }

    setItems([]);
    toast.success('Wishlist cleared');
  };

  const isInWishlist = (productId) => items.some((item) => item.id === productId);

  const value = useMemo(() => ({
    wishlistItems: items,
    wishlistCount: items.length,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    loading,
  }), [items, loading]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
