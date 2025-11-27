import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import * as cartAPI from '../api/cart';

const CartContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const resolveImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Handle object format {url: "...", alt: "..."}
  let url = imagePath;
  if (typeof imagePath === 'object' && imagePath.url) {
    url = imagePath.url;
  }
  
  // Ensure url is a string
  if (typeof url !== 'string') {
    return null;
  }
  
  if (url.startsWith('http')) return url;
  return `${FILE_BASE_URL}${url}`;
};

const normalizeCartItems = (items = []) => items.map((item) => {
  const productData = typeof item.product === 'object' ? item.product : {};
  const id = productData._id || item.product || item.id;

  // Handle images - can be array of objects or array of strings
  let imagePath = null;
  if (productData.images && productData.images.length > 0) {
    imagePath = productData.images[0];
  } else if (productData.image) {
    imagePath = productData.image;
  }

  return {
    id,
    _id: id,
    name: productData.name || item.name,
    price: item.price ?? productData.price ?? 0,
    quantity: item.quantity || 1,
    image: resolveImageUrl(imagePath),
    stock: productData.stock,
  };
});

const createCartItemFromProduct = (product, quantity) => {
  const id = product?._id || product?.id;
  
  // Handle images - can be array of objects or array of strings, or a single image property
  let imagePath = null;
  if (product?.image) {
    imagePath = product.image;
  } else if (product?.images && product.images.length > 0) {
    imagePath = product.images[0];
  }

  return {
    id,
    _id: id,
    name: product?.name,
    price: product?.price || 0,
    quantity,
    image: resolveImageUrl(imagePath),
    stock: product?.stock,
  };
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from backend if authenticated, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const cart = await cartAPI.getCart();
          setCartItems(normalizeCartItems(cart.items));
        } catch (error) {
          console.error('Error loading cart:', error);
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        } finally {
          setLoading(false);
        }
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product?._id || product?.id;
    if (!productId) {
      toast.error('Missing product information');
      return;
    }
    
    if (isAuthenticated) {
      try {
        await cartAPI.addToCart(productId, quantity);
        // Reload cart from backend
        const cart = await cartAPI.getCart();
        setCartItems(normalizeCartItems(cart.items));
        toast.success('Added to cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(error.message || 'Failed to add to cart');
        // Fallback to local state
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
          if (existingItem) {
            return prevItems.map((item) =>
              (item._id || item.id) === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prevItems, createCartItemFromProduct(product, quantity)];
        });
      }
    } else {
      // Local state for guest users
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
        if (existingItem) {
          return prevItems.map((item) =>
            (item._id || item.id) === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, createCartItemFromProduct(product, quantity)];
      });
      toast.success('Added to cart');
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await cartAPI.removeFromCart(productId);
        // Reload cart from backend
        const cart = await cartAPI.getCart();
        setCartItems(normalizeCartItems(cart.items));
        toast.success('Item removed');
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast.error(error.message || 'Failed to remove item');
        // Fallback to local state
        setCartItems((prevItems) => 
          prevItems.filter((item) => (item._id || item.id) !== productId)
        );
      }
    } else {
      setCartItems((prevItems) => 
        prevItems.filter((item) => (item._id || item.id) !== productId)
      );
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        await cartAPI.updateCartItem(productId, quantity);
        // Reload cart from backend
        const cart = await cartAPI.getCart();
        setCartItems(normalizeCartItems(cart.items));
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error(error.message || 'Failed to update cart');
        // Fallback to local state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            (item._id || item.id) === productId ? { ...item, quantity } : item
          )
        );
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        setCartItems([]);
        toast.success('Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error);
        setCartItems([]);
        toast.error(error.message || 'Failed to clear cart');
      }
    } else {
      setCartItems([]);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
