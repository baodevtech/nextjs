import React, { useState, useContext, createContext, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Phone, MessageCircle } from 'lucide-react';

import { Product, CartItem } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/common/UI';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

// --- CONTEXT SETUP ---
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  cartTotal: number;
  itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Export custom hook for pages to use
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price.amount * item.quantity), 0);
  }, [cart]);

  const itemsCount = useMemo(() => cart.reduce((c, item) => c + item.quantity, 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, toggleCart, cartTotal, itemsCount }}>
      {children}
    </CartContext.Provider>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const FloatingContact = () => (
  <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
    <a href="tel:0912345678" className="w-12 h-12 bg-red-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform animate-bounce">
      <Phone size={20} />
    </a>
    <a href="#" className="w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
      <span className="font-bold text-xs">Zalo</span>
    </a>
  </div>
);

// --- APP ROOT ---

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <ScrollToTop />
        <MainLayout />
      </HashRouter>
    </CartProvider>
  );
};

const MainLayout: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal, itemsCount } = useCart();

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white selection:bg-brand-100 selection:text-brand-900">
      <Header cartCount={itemsCount} onToggleCart={toggleCart} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={toggleCart} 
        cart={cart} 
        onRemove={removeFromCart} 
        onUpdateQty={updateQuantity}
        total={cartTotal}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="*" element={<div className="pt-32 text-center text-gray-500">Trang không tồn tại</div>} />
        </Routes>
      </main>

      <FloatingContact />
      <Footer />
    </div>
  );
};

export default App;