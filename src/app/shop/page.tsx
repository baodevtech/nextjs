'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  getProducts, 
  getCategories, 
  getShopPageData, 
  getInStockTotal,
  type ShopSettings // Import Type từ service (hoặc từ types.ts tùy nơi bạn đặt)
} from '@/services/wpService';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductComponents';
import { useCart } from '@/context/CartContext';
import { 
    Search, ChevronDown, Check, LayoutGrid, List, Filter, 
    X, ShieldCheck, Truck, Palette, Info, HelpCircle, RefreshCcw, SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/common/UI';

// --- COMPONENT BREADCRUMB ---
const Breadcrumb: React.FC<{ categoryName?: string }> = ({ categoryName }) => (
    <nav className="flex text-xs text-slate-500 mb-4 z-10 relative">
        <Link href="/" className="hover:text-brand-600 transition-colors">Trang chủ</Link>
        <span className="mx-2 text-slate-300">/</span>
        <Link href="/shop" className="hover:text-brand-600 transition-colors">Cửa hàng</Link>
        {categoryName && (
            <>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900 font-semibold">{categoryName}</span>
            </>
        )}
    </nav>
);

// --- COMPONENT HELPER: BENEFIT ICON ---
// Hiển thị ảnh từ ACF nếu có, nếu không thì dùng Icon mặc định của Lucide
const BenefitIcon = ({ src, FallbackIcon, colorClass, bgClass }: any) => {
    if (src) {
        return (
            <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center overflow-hidden shrink-0`}>
                 <img src={src} alt="icon" className="w-5 h-5 object-contain" />
            </div>
        );
    }
    return (
        <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center ${colorClass} shrink-0`}>
            <FallbackIcon size={18} />
        </div>
    );
};

// --- COMPONENT SHOP HEADER (BANNER) ---
const ShopHeader: React.FC<{ 
    category?: Category, 
    productCount: number,
    shopSettings?: ShopSettings | null 
}> = ({ category, productCount, shopSettings }) => {

    // TRƯỜNG HỢP 1: Trang Cửa hàng (Tất cả sản phẩm) -> Dùng Shop Settings từ ACF
    if (!category) {
        // Fallback data nếu chưa nhập trong Admin
        const desc = shopSettings?.description || "Khám phá bộ sưu tập vật liệu ốp tường cao cấp, được tuyển chọn kỹ lưỡng để mang lại vẻ đẹp bền vững cho ngôi nhà của bạn.";
        const b1 = shopSettings?.benefits?.warranty;
        const b2 = shopSettings?.benefits?.shipping;
        const b3 = shopSettings?.benefits?.variety;

        return (
             <div className="mb-10 bg-gradient-to-br from-brand-50 via-white to-brand-50 rounded-2xl p-8 md:p-12 border border-brand-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 max-w-2xl flex-1">
                    <Breadcrumb />
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Tất Cả Sản Phẩm
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-lg">
                        {desc}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm text-xs font-bold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        {productCount} Sản phẩm sẵn sàng
                    </div>
                </div>

                <div className="relative z-10 hidden md:grid grid-cols-2 gap-3 min-w-[280px]">
                    {/* Benefit 1 */}
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-brand-100 flex flex-col items-center text-center gap-2 hover:transform hover:scale-105 transition-transform duration-300">
                        <BenefitIcon src={b1?.icon} FallbackIcon={ShieldCheck} bgClass="bg-brand-100" colorClass="text-brand-600" />
                        <div>
                            <p className="font-bold text-xs text-slate-900">{b1?.heading || 'Bảo hành 15 năm'}</p>
                            <p className="text-[10px] text-slate-500">{b1?.subHeading || 'Chính hãng'}</p>
                        </div>
                    </div>
                    {/* Benefit 2 */}
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-brand-100 flex flex-col items-center text-center gap-2 hover:transform hover:scale-105 transition-transform duration-300">
                        <BenefitIcon src={b2?.icon} FallbackIcon={Truck} bgClass="bg-orange-100" colorClass="text-orange-600" />
                        <div>
                            <p className="font-bold text-xs text-slate-900">{b2?.heading || 'Giao hàng 24h'}</p>
                            <p className="text-[10px] text-slate-500">{b2?.subHeading || 'Toàn quốc'}</p>
                        </div>
                    </div>
                    {/* Benefit 3 */}
                    <div className="col-span-2 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-brand-100 flex items-center gap-4 hover:transform hover:scale-105 transition-transform duration-300">
                         <BenefitIcon src={b3?.icon} FallbackIcon={Palette} bgClass="bg-purple-100" colorClass="text-purple-600" />
                        <div className="text-left">
                            <p className="font-bold text-xs text-slate-900">{b3?.heading || 'Đa dạng mẫu mã'}</p>
                            <p className="text-[10px] text-slate-500">{b3?.subHeading || '500+ Texture'}</p>
                        </div>
                    </div>
                </div>
                
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
            </div>
        );
    }

    // TRƯỜNG HỢP 2: Trang Chi tiết Danh mục -> Dùng Header Banner của Danh mục
    return (
        <div className="mb-10 rounded-2xl overflow-hidden relative min-h-[280px] flex flex-col md:flex-row items-center">
            <div className="absolute inset-0">
                <img 
                    src={category.headerImage || category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="max-w-2xl">
                    <nav className="flex text-xs text-slate-300 mb-4">
                        <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
                        <span className="mx-2 text-slate-500">/</span>
                        <Link href="/shop" className="hover:text-white transition-colors">Cửa hàng</Link>
                        <span className="mx-2 text-slate-500">/</span>
                        <span className="text-white font-semibold">{category.name}</span>
                    </nav>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-sm">
                        {category.name}
                    </h1>
                    <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl mb-6 font-light">
                        {category.description}
                    </p>
                    
                    <div className="flex items-center gap-4">
                         <Button variant="primary" className="py-2 px-4 text-xs bg-white text-slate-900 hover:bg-slate-100 border-none">
                            Xem {productCount} Sản phẩm
                         </Button>
                    </div>
                </div>

                <div className="hidden md:flex flex-col gap-3 min-w-[200px]">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
                        <p className="text-xs text-brand-200 font-bold uppercase tracking-wider mb-1">{category.trendHeader || 'Xu hướng'}</p>
                        <p className="text-sm font-medium">{category.trendContent || 'Mới cập nhật'}</p>
                    </div>
                     <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                           <span className="text-2xl font-bold">{productCount}</span>
                           <span className="text-[10px] text-slate-300 uppercase">Mã màu</span>
                        </div>
                        <div className="h-8 w-px bg-white/20"></div>
                        <div className="flex flex-col">
                           <span className="text-2xl font-bold">{category.warrantyMonths || 10}</span>
                           <span className="text-[10px] text-slate-300 uppercase">Năm BH</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT FILTER ---
const FilterSection: React.FC<{ 
    title: string, 
    isOpen?: boolean, 
    children: React.ReactNode 
}> = ({ title, isOpen = true, children }) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <div className="border-b border-gray-100 py-5 last:border-0">
            <button 
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-sm font-bold text-slate-800 mb-4 hover:text-brand-600 transition-colors group"
            >
                {title}
                <ChevronDown size={16} className={`text-slate-400 group-hover:text-brand-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <div className="animate-fade-in">{children}</div>}
        </div>
    );
};

// --- MAIN CONTENT ---
function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null); // State chứa cấu hình Banner Shop
  const [inStockCount, setInStockCount] = useState(0); // State chứa tổng tồn kho thực tế
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isPromotion, setIsPromotion] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Fetch tất cả dữ liệu cần thiết song song
      const [prods, cats, settings, stock] = await Promise.all([
          getProducts(), 
          getCategories(),
          getShopPageData(), // Lấy settings banner
          getInStockTotal()  // Lấy số lượng tồn kho
      ]);
      setProducts(prods);
      setCategories(cats);
      setShopSettings(settings);
      setInStockCount(stock);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    setFilter(cat || 'all');
    setBrandFilter('all');
    setInStockOnly(false);
    setIsPromotion(false);
    setSearchQuery('');
  }, [searchParams]);

  const filteredProducts = products.filter(p => {
    const matchCategory = filter === 'all' || p.categories.includes(filter);
    const matchBrand = brandFilter === 'all' || p.brand === brandFilter;
    const matchStock = !inStockOnly || p.stockStatus === 'IN_STOCK';
    const matchPromo = !isPromotion || p.price.amount > 0;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchCategory && matchBrand && matchStock && matchPromo && matchSearch;
  });

  const currentCategory = categories.find(c => c.slug === filter);
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const getCategoryCount = (slug: string) => {
      return products.filter(p => {
          const matchCategory = slug === 'all' || p.categories.includes(slug);
          return matchCategory;
      }).length;
  };

  const getBrandCount = (brand: string) => {
      return products.filter(p => p.brand === brand).length;
  };

  const hasActiveFilters = filter !== 'all' || brandFilter !== 'all' || inStockOnly || isPromotion || searchQuery;

  const resetFilters = () => {
    setFilter('all');
    setBrandFilter('all');
    setInStockOnly(false);
    setIsPromotion(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* SHOP HEADER ĐƯỢC NÂNG CẤP */}
        <ShopHeader 
            category={currentCategory} 
            // Nếu có Category -> hiện số SP đã lọc. Nếu là Shop tổng -> hiện tổng tồn kho thực tế
            productCount={currentCategory ? filteredProducts.length : inStockCount} 
            shopSettings={shopSettings} // Truyền settings vào
        />

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className={`
            lg:w-72 flex-shrink-0 
            ${showMobileFilters ? 'fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-0 overflow-y-auto' : 'hidden lg:block'}
          `}>
             <div className="flex items-center justify-between lg:hidden p-4 border-b">
                <span className="text-lg font-bold flex items-center gap-2"><SlidersHorizontal size={20}/> Bộ Lọc</span>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
             </div>

             <div className="lg:sticky lg:top-24 bg-white lg:rounded-2xl lg:border border-gray-100 lg:shadow-xl lg:shadow-gray-200/40 p-5 space-y-2 h-full lg:h-auto lg:max-h-[85vh] overflow-y-auto no-scrollbar">
                
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Filter size={18} className="text-brand-600"/> Lọc Sản Phẩm
                    </h3>
                    {hasActiveFilters && (
                        <button 
                            onClick={resetFilters}
                            className="text-xs font-semibold text-brand-600 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                            <RefreshCcw size={12}/> Đặt lại
                        </button>
                    )}
                </div>

                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Tìm tên sản phẩm..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>

                <FilterSection title="Danh Mục">
                    <div className="space-y-1">
                        <div 
                            onClick={() => setFilter('all')}
                            className={`
                                group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border
                                ${filter === 'all' 
                                    ? 'bg-brand-50 border-brand-200 shadow-sm' 
                                    : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100'}
                            `}
                        >
                             <span className={`text-sm ${filter === 'all' ? 'font-bold text-brand-700' : 'font-medium text-slate-600'}`}>Tất cả</span>
                             <span className={`text-xs px-2 py-0.5 rounded-full ${filter === 'all' ? 'bg-white text-brand-700 font-bold shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                                 {getCategoryCount('all')}
                             </span>
                        </div>
                        
                        {categories.map(cat => {
                            const count = getCategoryCount(cat.slug);
                            const isActive = filter === cat.slug;
                            return (
                                <div 
                                    key={cat.id} 
                                    onClick={() => setFilter(cat.slug)}
                                    className={`
                                        group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border
                                        ${isActive 
                                            ? 'bg-brand-50 border-brand-200 shadow-sm' 
                                            : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100'}
                                    `}
                                >
                                    <span className={`text-sm ${isActive ? 'font-bold text-brand-700' : 'font-medium text-slate-600'}`}>{cat.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-brand-700 font-bold shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </FilterSection>

                <FilterSection title="Thương Hiệu">
                    <div className="space-y-1">
                        <div 
                            onClick={() => setBrandFilter('all')}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${brandFilter === 'all' ? 'bg-brand-50/50' : 'hover:bg-gray-50'}`}
                        >
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${brandFilter === 'all' ? 'border-brand-600 bg-brand-600' : 'border-gray-300'}`}>
                                 {brandFilter === 'all' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                             </div>
                             <span className={`text-sm flex-1 ${brandFilter === 'all' ? 'font-bold text-brand-700' : 'text-slate-600'}`}>Tất cả</span>
                        </div>
                        {brands.map(brand => {
                            const count = getBrandCount(brand);
                            const isActive = brandFilter === brand;
                            if (count === 0 && !isActive) return null;
                            
                            return (
                                <div 
                                    key={brand}
                                    onClick={() => setBrandFilter(brand)}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-brand-50/50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isActive ? 'border-brand-600 bg-brand-600' : 'border-gray-300 group-hover:border-brand-400'}`}>
                                        {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className={`text-sm flex-1 ${isActive ? 'font-bold text-brand-700' : 'text-slate-600'}`}>{brand}</span>
                                    <span className="text-xs text-slate-400">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </FilterSection>

                <FilterSection title="Trạng Thái">
                    <div className="space-y-2">
                        <div 
                            onClick={() => setInStockOnly(!inStockOnly)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${inStockOnly ? 'bg-brand-50 border-brand-200' : 'bg-white border-gray-200 hover:border-brand-200'}`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-brand-600 border-brand-600' : 'border-gray-300 bg-white'}`}>
                                {inStockOnly && <Check size={12} className="text-white" />}
                            </div>
                            <span className={`text-sm ${inStockOnly ? 'font-bold text-brand-700' : 'text-slate-600'}`}>Chỉ hiện còn hàng</span>
                        </div>

                        <div 
                            onClick={() => setIsPromotion(!isPromotion)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isPromotion ? 'bg-brand-50 border-brand-200' : 'bg-white border-gray-200 hover:border-brand-200'}`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPromotion ? 'bg-brand-600 border-brand-600' : 'border-gray-300 bg-white'}`}>
                                {isPromotion && <Check size={12} className="text-white" />}
                            </div>
                            <span className={`text-sm ${isPromotion ? 'font-bold text-brand-700' : 'text-slate-600'}`}>Đang giảm giá</span>
                        </div>
                    </div>
                </FilterSection>

                 <div className="lg:hidden mt-auto pt-4 border-t sticky bottom-0 bg-white p-4">
                     <Button fullWidth onClick={() => setShowMobileFilters(false)}>Xem {filteredProducts.length} Kết Quả</Button>
                 </div>
             </div>
          </aside>

          <div className="flex-1">
             <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <button 
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-sm transition-all"
                >
                    <SlidersHorizontal size={16} /> Bộ Lọc
                </button>

                <div className="hidden md:flex items-center gap-2">
                    {['Bán chạy nhất', 'Giá thấp - cao', 'Giá cao - thấp', 'Mới nhất'].map((sort, i) => (
                        <button key={i} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-gray-200 text-slate-600 hover:border-brand-500 hover:text-brand-600'}`}>
                            {sort}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-slate-500 mr-2 hidden sm:inline">Hiển thị:</span>
                    <button className="p-2 bg-slate-100 text-slate-900 rounded-md hover:bg-slate-200 transition-colors"><LayoutGrid size={18}/></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-50 rounded-md transition-colors"><List size={18}/></button>
                </div>
             </div>

             {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
                            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse"></div>
                            <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onQuickAdd={() => addToCart(product)}
                        />
                    ))}
                </div>
             )}

             {!loading && filteredProducts.length === 0 && (
                 <div className="text-center py-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                        <Search size={32} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-1">Không tìm thấy sản phẩm</h3>
                     <p className="text-slate-500 text-sm mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                     <button onClick={resetFilters} className="text-brand-600 font-bold text-sm hover:underline flex items-center justify-center gap-2 mx-auto">
                         <RefreshCcw size={14} /> Xóa toàn bộ bộ lọc
                     </button>
                 </div>
             )}
          </div>
        </div>

        {currentCategory?.bottomContent && (
            <div className="mt-20">
                <div className="relative bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                        <Info size={400} />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                        <div className="lg:w-1/4 flex-shrink-0 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 text-brand-600 font-bold mb-3 bg-brand-50 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                                    <Info size={14} />
                                    Thông tin hữu ích
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    Tìm hiểu về {currentCategory.name}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Kiến thức chuyên sâu giúp bạn lựa chọn vật liệu phù hợp nhất cho công trình.
                                </p>
                            </div>
                            
                            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <HelpCircle size={16} className="text-brand-500"/>
                                    Cần tư vấn thêm?
                                </h4>
                                <p className="text-xs text-slate-500 mb-4">Đội ngũ kỹ thuật Đại Nam luôn sẵn sàng hỗ trợ 24/7.</p>
                                <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                    Chat Zalo Ngay
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-3/4">
                            <div 
                                className="prose prose-slate max-w-none prose-headings: prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-brand-600 prose-a:font-bold hover:prose-a:text-brand-700 prose-img:rounded-2xl prose-img:shadow-md"
                                dangerouslySetInnerHTML={{ __html: currentCategory.bottomContent }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}