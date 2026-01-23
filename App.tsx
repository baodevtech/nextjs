import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Calculator,
  Phone,
  Ruler
} from 'lucide-react';

import { getProducts, getProductBySlug, getCategories } from './services/wpService';
import { Product, CartItem, Category } from './types';
import { askProductQuestion } from './services/geminiService';

// --- CONTEXT ---

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

const useCart = () => {
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

// --- UI COMPONENTS ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'accent' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "border border-transparent text-white bg-slate-900 hover:bg-slate-800 focus:ring-slate-900",
    secondary: "border border-transparent text-slate-900 bg-slate-100 hover:bg-slate-200 focus:ring-slate-500",
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500",
    accent: "border border-transparent text-white bg-amber-700 hover:bg-amber-800 focus:ring-amber-500"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        <img 
          src={product.image.sourceUrl} 
          alt={product.image.altText} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.stockStatus === 'OUT_OF_STOCK' && (
          <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur px-2 py-1 text-white text-xs font-bold rounded uppercase tracking-wide">
            Hết Hàng
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base text-slate-800 font-semibold group-hover:text-amber-700 transition-colors line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Kích thước: {product.dimensions.width}x{product.dimensions.length}mm
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-amber-700">
            {product.price.formatted}
            <span className="text-xs text-gray-500 font-normal ml-1">/thanh</span>
          </p>
          <div className="p-2 bg-gray-100 rounded-full group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-700 transition-colors">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={toggleCart} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform animate-in slide-in-from-right duration-300">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-serif font-bold text-slate-900">Giỏ Hàng ({cart.length})</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>Giỏ hàng chưa có sản phẩm nào.</p>
              <button onClick={toggleCart} className="mt-4 text-sm font-semibold text-amber-700 hover:underline">Tiếp tục xem mẫu</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                  <img src={item.image.sourceUrl} alt={item.image.altText} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{item.name}</h3>
                      <p className="text-sm font-bold text-amber-700 whitespace-nowrap ml-2">{item.price.formatted}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.dimensions.width} x {item.dimensions.length} mm</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-50 text-gray-500"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-medium w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-50 text-gray-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between text-base font-bold text-slate-900 mb-2">
              <p>Tạm tính</p>
              <p>{cartTotal.toLocaleString('vi-VN')}₫</p>
            </div>
            <p className="text-xs text-gray-500 mb-4">Phí vận chuyển sẽ được tính khi thanh toán.</p>
            <Button variant="accent" className="w-full">Thanh Toán Ngay</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const NavBar: React.FC = () => {
  const { toggleCart, itemsCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-100' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 -ml-2 hover:bg-black/5 rounded-md lg:hidden">
            <Menu size={24} />
          </button>
          <Link to="/" className={`text-2xl font-serif font-black tracking-tight flex items-center gap-2 ${scrolled ? 'text-slate-900' : 'text-slate-900 lg:text-white'}`}>
             <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white">VP</div>
             <span>VietPanel.</span>
          </Link>
          <nav className={`hidden lg:flex gap-8 ml-8 ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
            <Link to="/" className="text-sm font-semibold hover:text-amber-500 transition-colors">Trang Chủ</Link>
            <Link to="/shop" className="text-sm font-semibold hover:text-amber-500 transition-colors">Sản Phẩm</Link>
            <Link to="/about" className="text-sm font-semibold hover:text-amber-500 transition-colors">Dự Án</Link>
            <Link to="/contact" className="text-sm font-semibold hover:text-amber-500 transition-colors">Liên Hệ</Link>
          </nav>
        </div>
        <div className={`flex items-center gap-3 ${scrolled ? 'text-slate-800' : 'text-slate-800 lg:text-white'}`}>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
          >
            <ShoppingBag size={20} />
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-slate-300 py-16 mt-20">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <h3 className="text-2xl font-serif font-bold text-white mb-4">VietPanel.</h3>
        <p className="text-sm leading-relaxed mb-4">
          Tổng kho phân phối tấm ốp tường, trần nhựa, lam sóng, PVC vân đá uy tín hàng đầu. Giải pháp vật liệu nhẹ cho ngôi nhà hiện đại.
        </p>
        <div className="flex items-center gap-2 text-amber-500 font-bold">
           <Phone size={18} />
           <span>0912.345.678</span>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Sản Phẩm</h4>
        <ul className="space-y-3 text-sm">
          <li><Link to="/shop?cat=lam-song" className="hover:text-amber-500 transition-colors">Tấm ốp Lam Sóng</Link></li>
          <li><Link to="/shop?cat=nano" className="hover:text-amber-500 transition-colors">Tấm ốp Nano</Link></li>
          <li><Link to="/shop?cat=pvc-stone" className="hover:text-amber-500 transition-colors">PVC Vân Đá</Link></li>
          <li><Link to="/shop?cat=accessories" className="hover:text-amber-500 transition-colors">Phụ Kiện Thi Công</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Chính Sách</h4>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="hover:text-amber-500 transition-colors">Hướng dẫn mua hàng</a></li>
          <li><a href="#" className="hover:text-amber-500 transition-colors">Chính sách vận chuyển</a></li>
          <li><a href="#" className="hover:text-amber-500 transition-colors">Chính sách bảo hành</a></li>
          <li><a href="#" className="hover:text-amber-500 transition-colors">Đổi trả hàng hóa</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Đăng ký nhận tin</h4>
        <p className="text-xs mb-3">Nhận báo giá sỉ và thông tin khuyến mãi mới nhất.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="Email của bạn" className="bg-slate-800 border-none text-white text-sm p-3 w-full rounded focus:ring-1 focus:ring-amber-500 placeholder-slate-500" />
          <button className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded text-sm font-bold transition-colors">Gửi</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
      &copy; 2024 VietPanel. All rights reserved. Powered by Headless WordPress & Next.js Structure.
    </div>
  </footer>
);

// --- PAGES ---

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Simulating fetching data
    const loadData = async () => {
       const prods = await getProducts();
       setFeaturedProducts(prods.slice(0, 4));
       const cats = await getCategories();
       setCategories(cats);
    };
    loadData();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] bg-slate-900 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=2070&auto=format&fit=crop" 
            alt="Interior wall panel design" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl animate-in slide-in-from-bottom duration-700 fade-in">
            <span className="inline-block px-3 py-1 bg-amber-600/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-amber-600/30">
              Giải pháp nội thất 2024
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Kiến tạo không gian <br/>
              <span className="text-amber-500">Sang trọng & Đẳng cấp.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 font-light max-w-xl">
              VietPanel cung cấp các dòng tấm ốp Nano, Lam sóng, PVC vân đá chất lượng cao. Chống ẩm mốc, thi công nhanh, giá tại kho.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="accent" onClick={() => window.location.hash = '#/shop'}>Xem Báo Giá Ngay</Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-900">Liên Hệ Tư Vấn</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Danh Mục Sản Phẩm</h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories.map(cat => (
              <Link key={cat.id} to={`/shop?cat=${cat.slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg block hover:-translate-y-2 transition-transform duration-300">
                 <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center p-2">
                  <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                  <p className="text-xs text-slate-300 mt-1">{cat.count} mẫu</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
               <h2 className="text-2xl font-serif font-bold text-slate-900">Sản Phẩm Bán Chạy</h2>
               <p className="text-slate-500 text-sm mt-1">Lựa chọn hàng đầu cho các công trình hiện nay.</p>
            </div>
            <Link to="/shop" className="text-amber-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="flex flex-col items-center px-4 py-4">
            <div className="p-4 bg-slate-800 rounded-full mb-4 text-amber-500"><Truck size={32} /></div>
            <h4 className="font-bold text-lg mb-2">Giao Hàng Toàn Quốc</h4>
            <p className="text-sm text-slate-400">Hỗ trợ vận chuyển tận công trình. Ship cod kiểm tra hàng thanh toán.</p>
          </div>
          <div className="flex flex-col items-center px-4 py-4">
             <div className="p-4 bg-slate-800 rounded-full mb-4 text-amber-500"><ShieldCheck size={32} /></div>
            <h4 className="font-bold text-lg mb-2">Bảo Hành 15 Năm</h4>
            <p className="text-sm text-slate-400">Cam kết chất lượng. Đổi trả 1-1 nếu có lỗi từ nhà sản xuất.</p>
          </div>
          <div className="flex flex-col items-center px-4 py-4">
             <div className="p-4 bg-slate-800 rounded-full mb-4 text-amber-500"><CheckCircle size={32} /></div>
            <h4 className="font-bold text-lg mb-2">Giá Gốc Tại Kho</h4>
            <p className="text-sm text-slate-400">Nhập khẩu và phân phối trực tiếp, không qua trung gian.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat) setFilter(cat);
  }, [location]);

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.categories.includes(filter));

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
           <h1 className="text-3xl font-serif font-bold text-slate-900">Kho Sản Phẩm</h1>
           <span className="text-sm text-gray-500 mt-2 md:mt-0">Hiển thị {filteredProducts.length} sản phẩm</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-slate-900 flex items-center gap-2">
                <Menu size={16} /> Danh Mục
              </h3>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${filter === 'all' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setFilter(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${filter === cat.slug ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="aspect-[4/5] bg-gray-200 rounded-lg animate-pulse" />
                 ))}
               </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">Không tìm thấy sản phẩm nào trong danh mục này.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialCalculator: React.FC<{ product: Product, onAdd: (qty: number) => void }> = ({ product, onAdd }) => {
  const [width, setWidth] = useState<number>(0); // Meters
  const [height, setHeight] = useState<number>(0); // Meters
  const [result, setResult] = useState<{ boxes: number, waste: number } | null>(null);

  const calculate = () => {
    if (width <= 0 || height <= 0 || product.dimensions.area === 0) return;

    const wallArea = width * height;
    const panelArea = product.dimensions.area; // m2 per panel
    
    // Add 10% wastage for cutting
    const rawCount = wallArea / panelArea;
    const withWaste = rawCount * 1.1;
    const finalCount = Math.ceil(withWaste);
    
    setResult({ boxes: finalCount, waste: Math.round((finalCount * panelArea - wallArea) * 100) / 100 });
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <Calculator size={20} className="text-amber-600" />
        <h3 className="font-bold text-lg">Tính Toán Vật Tư</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">Nhập kích thước tường để tính số lượng tấm cần mua (đã bao gồm 10% hao hụt cắt ghép).</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Chiều Rộng Tường (m)</label>
          <input 
            type="number" 
            step="0.1"
            value={width || ''}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
            placeholder="Ví dụ: 3.5"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Chiều Cao Tường (m)</label>
          <input 
            type="number" 
            step="0.1"
            value={height || ''}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
            placeholder="Ví dụ: 2.8"
          />
        </div>
      </div>

      <Button onClick={calculate} variant="secondary" className="w-full mb-4">Tính Ngay</Button>

      {result && (
        <div className="bg-white p-4 rounded-lg border border-amber-100 animate-in fade-in zoom-in duration-300">
           <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Số lượng đề xuất:</span>
              <span className="text-xl font-bold text-amber-700">{result.boxes} Thanh/Tấm</span>
           </div>
           <div className="flex justify-between items-center mb-4 text-xs text-gray-400">
              <span>Dư dự kiến: {result.waste} m²</span>
           </div>
           <Button variant="accent" onClick={() => onAdd(result.boxes)} className="w-full py-2 text-xs">
             Thêm {result.boxes} Tấm Vào Giỏ
           </Button>
        </div>
      )}
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then(p => setProduct(p || null));
    }
  }, [slug]);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !aiQuestion.trim()) return;

    setIsAiLoading(true);
    setAiAnswer('');
    const answer = await askProductQuestion(product, aiQuestion);
    setAiAnswer(answer);
    setIsAiLoading(false);
  };

  if (!product) return <div className="pt-32 text-center text-gray-500">Đang tải sản phẩm...</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img src={product.image.sourceUrl} alt={product.image.altText} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {product.galleryImages.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-amber-500 cursor-pointer transition-colors">
                  <img src={img.sourceUrl} alt={img.altText} className="w-full h-full object-cover" />
                </div>
             ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500 mb-4 items-center flex-wrap gap-2">
              <Link to="/" className="hover:text-amber-600">Trang chủ</Link>
              <ChevronRight size={14} />
              <Link to="/shop" className="hover:text-amber-600">Sản phẩm</Link>
              <ChevronRight size={14} />
              <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
            <h1 className="text-3xl md:text-3xl font-serif font-bold text-slate-900 mb-3 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
               <p className="text-3xl font-bold text-amber-700">{product.price.formatted}</p>
               <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                  {product.stockStatus === 'IN_STOCK' ? 'Còn Hàng' : 'Hết Hàng'}
               </span>
            </div>
            
            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-100 mb-6">
               <div className="flex items-center gap-3">
                 <Ruler className="text-gray-400" size={20} />
                 <div>
                   <p className="text-xs text-gray-500">Kích thước</p>
                   <p className="font-semibold text-sm">{product.dimensions.width} x {product.dimensions.length} mm</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 font-bold">T</div>
                 <div>
                   <p className="text-xs text-gray-500">Độ dày</p>
                   <p className="font-semibold text-sm">{product.dimensions.thickness} mm</p>
                 </div>
               </div>
            </div>
          </div>

          <div 
            className="prose prose-sm text-slate-600 mb-8" 
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />

          <div className="flex gap-4 mb-8">
             <Button 
                onClick={() => addToCart(product)} 
                disabled={product.stockStatus === 'OUT_OF_STOCK'}
                className="flex-1 py-4 text-base"
                variant="accent"
             >
              {product.stockStatus === 'IN_STOCK' ? 'Thêm Vào Giỏ' : 'Tạm Hết Hàng'}
             </Button>
          </div>

          {product.dimensions.area > 0 && <MaterialCalculator product={product} onAdd={(qty) => addToCart(product, qty)} />}

          {/* AI Assistant */}
          <div className="mt-8 bg-indigo-50/50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-900">
              <Sparkles size={18} className="text-indigo-600" />
              <h3 className="font-bold text-sm uppercase tracking-wide">Trợ Lý AI VietPanel</h3>
            </div>
            
            <form onSubmit={handleAiAsk} className="relative">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Hỏi về cách thi công, phối màu, độ bền..."
                className="w-full pl-4 pr-12 py-3 rounded-md border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm bg-white"
              />
              <button 
                type="submit"
                disabled={isAiLoading || !aiQuestion}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </form>

            {isAiLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150" />
                Đang phân tích kỹ thuật...
              </div>
            )}

            {aiAnswer && (
              <div className="mt-4 p-4 bg-white rounded-md shadow-sm border border-indigo-100 relative">
                 <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-indigo-100 transform rotate-45"></div>
                 <p className="text-sm text-slate-700 leading-relaxed">{aiAnswer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- APP ROOT ---

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans bg-white selection:bg-amber-100 selection:text-amber-900">
          <NavBar />
          <CartDrawer />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="*" element={<div className="pt-32 text-center text-gray-500">Trang không tồn tại</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </CartProvider>
  );
};

export default App;