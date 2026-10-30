import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ShopContext = createContext(null);

const CART_KEY = 'steamlite_cart';
const LIBRARY_KEY = 'steamlite_library';

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem(LIBRARY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  }, [cart]);

  // Sync library to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    } catch (e) {
      console.error("Error saving library to localStorage", e);
    }
  }, [library]);

  const showToast = useCallback((message, type = 'default') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  const isInCart = useCallback((gameId) => {
    return cart.some(item => item.id === gameId);
  }, [cart]);

  const isInLibrary = useCallback((gameId) => {
    return library.some(item => item.id === gameId);
  }, [library]);

  const addToCart = useCallback((game) => {
    if (isInLibrary(game.id)) {
      showToast(`Ya tienes "${game.title}" en tu biblioteca`, 'default');
      return false;
    }
    if (isInCart(game.id)) {
      showToast(`"${game.title}" ya está en tu carrito`, 'default');
      return false;
    }
    setCart(prev => [...prev, game]);
    showToast(`"${game.title}" agregado al carrito`, 'success');
    return true;
  }, [isInLibrary, isInCart, showToast]);

  const removeFromCart = useCallback((gameId) => {
    setCart(prev => {
      const item = prev.find(g => g.id === gameId);
      if (item) {
        showToast(`"${item.title}" eliminado del carrito`, 'danger');
      }
      return prev.filter(g => g.id !== gameId);
    });
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Carrito vaciado', 'default');
  }, [showToast]);

  const checkout = useCallback(() => {
    if (cart.length === 0) return [];
    
    // Merge without duplicates into library
    const currentLib = [...library];
    const purchased = [];
    cart.forEach(item => {
      if (!currentLib.some(g => g.id === item.id)) {
        currentLib.push(item);
        purchased.push(item);
      }
    });

    setLibrary(currentLib);
    setCart([]);
    return purchased;
  }, [cart, library]);

  const cartTotal = cart.reduce((sum, g) => sum + (Number(g.price) || 0), 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        library,
        cartTotal,
        cartCount: cart.length,
        libraryCount: library.length,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        isInCart,
        isInLibrary,
        showToast
      }}
    >
      {children}
      {toast && (
        <div className={`steam-toast ${toast.type}`}>
          <span>🎮</span>
          <span>{toast.message}</span>
        </div>
      )}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
