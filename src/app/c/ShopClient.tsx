'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product, Category } from "@/types";
import { type ShopSettings } from "@/services/wpService";
import { ProductCard } from "@/components/product/ProductComponents";
import { useCart } from "@/context/CartContext";
import {
  Search,
  ChevronDown,
  Check,
  LayoutGrid,
  List,
  Filter,
  X,
  ShieldCheck,
  Truck,
  Palette,
  Info,
  HelpCircle,
  RefreshCcw,
  SlidersHorizontal,
  ArrowDown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/common/UI";

// --- 1. COMPONENT BREADCRUMB ---
const Breadcrumb: React.FC<{ categoryName?: string }> = ({ categoryName }) => (
  <nav className="flex text-[10px] md:text-xs text-slate-300 mb-2 md:mb-4 z-10 relative whitespace-nowrap overflow-hidden text-ellipsis pr-24 md:pr-0">
    <Link href="/" className="hover:text-white transition-colors">
      Trang chủ
    </Link>
    <span className="mx-1.5 text-slate-500">/</span>
    <Link href="/c" className="hover:text-white transition-colors">
      Cửa hàng
    </Link>
    {categoryName && (
      <>
        <span className="mx-1.5 text-slate-500">/</span>
        <span className="text-white font-semibold truncate">{categoryName}</span>
      </>
    )}
  </nav>
);

// --- 2. COMPONENT HELPER: BENEFIT ICON ---
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

// --- 3. COMPONENT SHOP HEADER ---
const ShopHeader: React.FC<{
  category?: Category;
  productCount: number;
  shopSettings?: ShopSettings | null;
}> = ({ category, productCount, shopSettings }) => {
  
  const scrollToProducts = () => {
    const productSection = document.getElementById('product-grid-section');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!category) {
    const desc = shopSettings?.description || "Khám phá bộ sưu tập vật liệu ốp tường cao cấp.";
    const b1 = shopSettings?.benefits?.warranty;
    const b2 = shopSettings?.benefits?.shipping;
    const b3 = shopSettings?.benefits?.variety;

    return (
      <div className="mb-6 md:mb-10 bg-gradient-to-br from-brand-50 via-white to-brand-50 rounded-xl md:rounded-2xl p-5 md:p-12 border border-brand-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="relative z-10 max-w-2xl flex-1 w-full">
          <nav className="flex text-[10px] md:text-xs text-slate-500 mb-3 md:mb-4 z-10 relative">
            <Link href="/" className="hover:text-brand-600 transition-colors">Trang chủ</Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <Link href="/c" className="hover:text-brand-600 transition-colors font-semibold">Cửa hàng</Link>
          </nav>
          
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-3">
            Tất Cả Sản Phẩm
          </h1>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-lg line-clamp-2 md:line-clamp-none">
            {desc}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm text-[10px] md:text-xs font-bold text-slate-600">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-500 animate-pulse"></span>
            {productCount} Sản phẩm hiển thị
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto flex md:grid md:grid-cols-2 gap-3 overflow-x-auto pb-2 md:pb-0 snap-x no-scrollbar md:min-w-[280px]">
          <div className="snap-start shrink-0 min-w-[150px] md:min-w-0 bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-sm border border-brand-100 flex flex-col items-center text-center gap-2">
            <BenefitIcon src={b1?.icon} FallbackIcon={ShieldCheck} bgClass="bg-brand-100" colorClass="text-brand-600" />
            <div>
              <p className="font-bold text-xs text-slate-900">{b1?.heading || "Bảo hành 15 năm"}</p>
              <p className="text-[10px] text-slate-500">{b1?.subHeading || "Chính hãng"}</p>
            </div>
          </div>
          <div className="snap-start shrink-0 min-w-[150px] md:min-w-0 bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-sm border border-brand-100 flex flex-col items-center text-center gap-2">
            <BenefitIcon src={b2?.icon} FallbackIcon={Truck} bgClass="bg-orange-100" colorClass="text-orange-600" />
            <div>
              <p className="font-bold text-xs text-slate-900">{b2?.heading || "Giao hàng 24h"}</p>
              <p className="text-[10px] text-slate-500">{b2?.subHeading || "Toàn quốc"}</p>
            </div>
          </div>
          <div className="snap-start shrink-0 min-w-[180px] md:min-w-0 md:col-span-2 bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-sm border border-brand-100 flex items-center gap-3 md:gap-4">
            <BenefitIcon src={b3?.icon} FallbackIcon={Palette} bgClass="bg-purple-100" colorClass="text-purple-600" />
            <div className="text-left">
              <p className="font-bold text-xs text-slate-900">{b3?.heading || "Đa dạng mẫu mã"}</p>
              <p className="text-[10px] text-slate-500">{b3?.subHeading || "500+ Texture"}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-brand-100/40 rounded-full blur-3xl -mr-16 -mt-16 md:-mr-24 md:-mt-24 pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="mb-6 md:mb-10 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[220px] md:min-h-[280px] flex flex-col md:flex-row items-center group">
      <div className="absolute inset-0">
        <img src={category.headerImage || category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent"></div>
      </div>

      <div className="relative z-10 p-5 md:p-12 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
        <div className="max-w-2xl w-full relative">
          <button
            onClick={scrollToProducts}
            className="md:hidden absolute top-0 right-0 z-30 bg-amber-400 text-dark text-[7px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-brand-900/20 flex items-center gap-1 active:scale-95 transition-transform hover:bg-brand-500"
          >
            Xem SP <ArrowDown size={12} strokeWidth={3} />
          </button>

          <Breadcrumb categoryName={category.name} />

          <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-sm pr-12 md:pr-0">
            {category.name}
          </h1>
          <p className="text-slate-200 text-xs md:text-base leading-relaxed max-w-xl mb-4 md:mb-6 font-light line-clamp-2 md:line-clamp-none">
            {category.description}
          </p>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="primary" className="py-2 px-4 text-xs bg-brand-500 text-white hover:bg-slate-100 border-none" onClick={scrollToProducts}>
              Xem Sản phẩm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-col gap-3 w-full md:w-auto min-w-[200px]">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl text-white">
            <p className="text-[10px] md:text-xs text-brand-200 font-bold uppercase tracking-wider mb-1">
              {category.trendHeader || "Xu hướng"}
            </p>
            <p className="text-xs md:text-sm font-medium truncate">
              {category.trendContent || "Mới cập nhật"}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl text-white flex items-center justify-between gap-2 md:gap-4">
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold">
                {category.warrantyMonths || 10}
              </span>
              <span className="text-[9px] md:text-[10px] text-slate-300 uppercase">
                Năm BH
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. COMPONENT FILTER SECTION ---
const FilterSection: React.FC<{
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, isOpen = true, children }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="border-b border-gray-100 py-4 md:py-5 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-bold text-slate-800 mb-3 md:mb-4 hover:text-brand-600 transition-colors group">
        {title}
        <ChevronDown size={16} className={`text-slate-400 group-hover:text-brand-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="animate-fade-in">{children}</div>}
    </div>
  );
};

// --- 5. MAIN CONTENT (SHOP CLIENT) ---

interface ShopClientProps {
  initialProducts: Product[];
  initialPageInfo?: { endCursor: string; hasNextPage: boolean }; 
  initialCategories: Category[];
  initialShopSettings: ShopSettings | null;
  categorySlug?: string; 
}

const SORT_OPTIONS = ["Mới nhất", "Bán chạy nhất", "Giá thấp - cao", "Giá cao - thấp"];

export default function ShopClient({
  initialProducts,
  initialPageInfo,
  initialCategories,
  initialShopSettings,
  categorySlug,
}: ShopClientProps) {
  
  // 👉 1. STATE BỘ LỌC
  const [filter, setFilter] = useState(categorySlug || "all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isPromotion, setIsPromotion] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 👉 2. LOGIC LƯU CACHE
  const cacheKey = `shop_state_${categorySlug || "all"}`;

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try { return JSON.parse(cached).products; } catch (e) {}
      }
    }
    return initialProducts;
  });

  const [endCursor, setEndCursor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try { return JSON.parse(cached).endCursor; } catch (e) {}
      }
    }
    return initialPageInfo?.endCursor || "";
  });

  const [hasNextPage, setHasNextPage] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try { return JSON.parse(cached).hasNextPage; } catch (e) {}
      }
    }
    return initialPageInfo?.hasNextPage ?? (initialProducts.length >= 12);
  });

  const [isLoading, setIsLoading] = useState(false); // Trạng thái Load khi Lọc
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Trạng thái Load khi Xem thêm

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        products,
        endCursor,
        hasNextPage
      }));
    }
  }, [products, endCursor, hasNextPage, cacheKey]);

  const categories = initialCategories;
  const shopSettings = initialShopSettings;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Danh sách thương hiệu hiện có (Tạm thời lấy từ list sản phẩm tải lần đầu)
  const brands = Array.from(new Set(initialProducts.map((p) => p.brand).filter(Boolean)));

  // 👉 3. HÀM FETCH DỮ LIỆU TỪ SERVER DÀNH CHO CẢ "LỌC MỚI" VÀ "XEM THÊM"
  const fetchProductsFromServer = async (isLoadMore = false) => {
    if (isLoadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first: 12,
          after: isLoadMore ? endCursor : "", // Nếu lọc mới thì lấy từ đầu, nếu xem thêm thì nối tiếp
          category: filter,
          search: searchQuery,
          brand: brandFilter,
          inStockOnly,
          isPromotion,
          sortBy
        })
      });

      const json = await res.json();
      
      if (json.success) {
        const newData = json.data;
        
        if (isLoadMore) {
          // Gắn thêm vào danh sách (Lọc ID trùng)
          setProducts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewProducts = newData.products.filter(
              (p: Product) => !existingIds.has(p.id)
            );
            return [...prev, ...uniqueNewProducts];
          });
        } else {
          // Ghi đè danh sách (Khi đổi bộ lọc)
          setProducts(newData.products);
        }

        setEndCursor(newData.pageInfo.endCursor);
        setHasNextPage(newData.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // 👉 4. ĐỒNG BỘ URL & LẮNG NGHE LỌC (DEBOUNCE)
  useEffect(() => {
    const currentCat = categorySlug || searchParams.get("cat") || "all";
    
    // Nếu đổi danh mục trên URL
    if (currentCat !== filter) {
      setFilter(currentCat);

      const newCacheKey = `shop_state_${currentCat}`;
      let cachedData = null;
      if (typeof window !== 'undefined') {
        const cachedStr = sessionStorage.getItem(newCacheKey);
        if (cachedStr) {
          try { cachedData = JSON.parse(cachedStr); } catch (e) {}
        }
      }

      if (cachedData) {
        setProducts(cachedData.products);
        setEndCursor(cachedData.endCursor);
        setHasNextPage(cachedData.hasNextPage);
      } else {
        setProducts(initialProducts);
        setEndCursor(initialPageInfo?.endCursor || "");
        setHasNextPage(initialPageInfo?.hasNextPage ?? (initialProducts.length >= 12));
      }

      setBrandFilter("all");
      setInStockOnly(false);
      setIsPromotion(false);
      setSearchQuery("");
      setSortBy(SORT_OPTIONS[0]);
      return; 
    }
  }, [categorySlug, searchParams, initialProducts, initialPageInfo, filter]);

  // 👉 THÊM DÒNG NÀY NGAY TRÊN useEffect: Tạo cờ đánh dấu lần render đầu tiên
  const isInitialRender = React.useRef(true);

  // DEBOUNCE EFFECT: Gọi API khi có bất kỳ bộ lọc nào bị thay đổi
  useEffect(() => {
    // 1. Bỏ qua lần chạy đầu tiên khi mới vào trang để KHÔNG làm mất dữ liệu Cache (khi bấm Back)
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return; 
    }

    // 2. Nếu tất cả bộ lọc đều bị xóa trắng/về mặc định (Ví dụ: Xóa hết chữ tìm kiếm)
    if (
      filter === (categorySlug || "all") &&
      brandFilter === "all" &&
      !inStockOnly &&
      !isPromotion &&
      searchQuery === "" &&
      sortBy === SORT_OPTIONS[0]
    ) {
      // TRẢ LẠI 12 SẢN PHẨM MẶC ĐỊNH MÀ KHÔNG CẦN GỌI API
      setProducts(initialProducts);
      setEndCursor(initialPageInfo?.endCursor || "");
      setHasNextPage(initialPageInfo?.hasNextPage ?? (initialProducts.length >= 12));
      return;
    }

    // 3. Nếu có gõ tìm kiếm hoặc đổi bộ lọc -> Delay 500ms rồi gọi API
    const delayDebounceFn = setTimeout(() => {
      fetchProductsFromServer(false); 
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filter, brandFilter, inStockOnly, isPromotion, searchQuery, sortBy, categorySlug, initialProducts, initialPageInfo]);

  const handleCategoryChange = (slug: string) => {
    if (slug === "all") {
      router.push('/c'); 
    } else {
      router.push(`/c/${slug}`); 
    }
  };

  // Đếm đúng số lượng danh mục từ Server
  const getCategoryCount = (slug: string) => {
    if (slug === "all") {
      return categories.reduce((total, cat) => total + (cat.count || 0), 0);
    }
    const category = categories.find(c => c.slug === slug);
    return category?.count || 0;
  };

  const currentCategory = categories.find((c) => c.slug === filter);
  const hasActiveFilters = brandFilter !== "all" || inStockOnly || isPromotion || searchQuery || sortBy !== SORT_OPTIONS[0];

  const resetFilters = () => {
    setBrandFilter("all");
    setInStockOnly(false);
    setIsPromotion(false);
    setSearchQuery("");
    setSortBy(SORT_OPTIONS[0]);
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <ShopHeader
          category={currentCategory}
          productCount={products.length}
          shopSettings={shopSettings}
        />

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          {/* SIDEBAR FILTER */}
          <aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? "fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-0 overflow-y-auto" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between lg:hidden p-4 border-b sticky top-0 bg-white z-10">
              <span className="text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal size={20} /> Bộ Lọc
              </span>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="lg:sticky lg:top-24 bg-white lg:rounded-2xl lg:border border-gray-100 lg:shadow-xl lg:shadow-gray-200/40 p-5 space-y-2 h-full lg:h-auto lg:max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Filter size={18} className="text-brand-600" /> Lọc Sản Phẩm
                </h3>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="text-xs font-semibold text-brand-600 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                    <RefreshCcw size={12} /> Đặt lại
                  </button>
                )}
              </div>
              
              <div className="relative mb-6">
                 <input type="text" placeholder="Tìm tên sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                 <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>

              <FilterSection title="Danh Mục">
                 <div className="space-y-1">
                    <div onClick={() => handleCategoryChange("all")} className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border ${filter === "all" ? "bg-brand-50 border-brand-200 shadow-sm" : "bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100"}`}>
                        <span className={`text-sm ${filter === "all" ? "font-bold text-brand-700" : "font-medium text-slate-600"}`}>Tất cả</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${filter === "all" ? "bg-white text-brand-700 font-bold shadow-sm" : "bg-gray-100 text-gray-500"}`}>{getCategoryCount("all")}</span>
                    </div>
                    {categories.map((cat) => {
                       const count = getCategoryCount(cat.slug);
                       const isActive = filter === cat.slug;
                       return (
                         <div key={cat.id} onClick={() => handleCategoryChange(cat.slug)} className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border ${isActive ? "bg-brand-50 border-brand-200 shadow-sm" : "bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100"}`}>
                            <span className={`text-sm ${isActive ? "font-bold text-brand-700" : "font-medium text-slate-600"}`}>{cat.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white text-brand-700 font-bold shadow-sm" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                         </div>
                       );
                    })}
                 </div>
              </FilterSection>

              <FilterSection title="Thương Hiệu">
                <div className="space-y-1">
                  <div onClick={() => setBrandFilter("all")} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${brandFilter === "all" ? "bg-brand-50/50" : "hover:bg-gray-50"}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${brandFilter === "all" ? "border-brand-600 bg-brand-600" : "border-gray-300"}`}>{brandFilter === "all" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}</div>
                    <span className={`text-sm flex-1 ${brandFilter === "all" ? "font-bold text-brand-700" : "text-slate-600"}`}>Tất cả</span>
                  </div>
                  {brands.map((brand) => {
                     const isActive = brandFilter === brand;
                     return (
                       <div key={brand as string} onClick={() => setBrandFilter(brand as string)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-brand-50/50" : "hover:bg-gray-50"}`}>
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isActive ? "border-brand-600 bg-brand-600" : "border-gray-300 group-hover:border-brand-400"}`}>{isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}</div>
                         <span className={`text-sm flex-1 ${isActive ? "font-bold text-brand-700" : "text-slate-600"}`}>{brand as string}</span>
                       </div>
                     );
                  })}
                </div>
              </FilterSection>

              <FilterSection title="Trạng Thái">
                 <div className="space-y-2">
                    <div onClick={() => setInStockOnly(!inStockOnly)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${inStockOnly ? "bg-brand-50 border-brand-200" : "bg-white border-gray-200 hover:border-brand-200"}`}>
                       <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStockOnly ? "bg-brand-600 border-brand-600" : "border-gray-300 bg-white"}`}>{inStockOnly && <Check size={12} className="text-white" />}</div>
                       <span className={`text-sm ${inStockOnly ? "font-bold text-brand-700" : "text-slate-600"}`}>Chỉ hiện còn hàng</span>
                    </div>
                    <div onClick={() => setIsPromotion(!isPromotion)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isPromotion ? "bg-brand-50 border-brand-200" : "bg-white border-gray-200 hover:border-brand-200"}`}>
                       <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPromotion ? "bg-brand-600 border-brand-600" : "border-gray-300 bg-white"}`}>{isPromotion && <Check size={12} className="text-white" />}</div>
                       <span className={`text-sm ${isPromotion ? "font-bold text-brand-700" : "text-slate-600"}`}>Đang giảm giá</span>
                    </div>
                 </div>
              </FilterSection>

              <div className="lg:hidden mt-auto pt-4 border-t sticky bottom-0 bg-white p-4">
                <Button fullWidth onClick={() => setShowMobileFilters(false)}>Xem Kết Quả</Button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {/* Toolbar Mobile & Sắp xếp */}
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4 md:mb-6">
              <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95">
                <SlidersHorizontal size={14} /> Bộ Lọc
              </button>

              <div className="hidden md:flex items-center gap-2">
                {SORT_OPTIONS.map((sort, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSortBy(sort)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        sortBy === sort 
                            ? "bg-slate-900 text-white shadow-md" 
                            : "bg-white border border-gray-200 text-slate-600 hover:border-brand-500 hover:text-brand-600"
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
               <span className="text-xs font-medium text-slate-500 mr-2 hidden sm:inline">
                  Hiển thị: <span className="text-brand-600 font-bold">{products.length}</span> / {getCategoryCount(filter)}
                </span>
                <button className="p-1.5 md:p-2 bg-slate-100 text-slate-900 rounded-md hover:bg-slate-200 transition-colors"><LayoutGrid size={16} /></button>
                <button className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-50 rounded-md transition-colors"><List size={16} /></button>
              </div>
            </div>

            {/* PRODUCT GRID - CÓ THÊM HIỆU ỨNG LOADING OVERLAY */}
            <div id="product-grid-section" className="scroll-mt-24 relative min-h-[400px]">
                
              
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-10">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} onQuickAdd={() => addToCart(product)} />
                      ))}
                    </div>
                    
                    {/* --- NÚT TẢI THÊM SẢN PHẨM --- */}
                   {hasNextPage && (
    <div className="mt-10 md:mt-14 flex justify-center animate-fade-in">
      <button 
        onClick={() => fetchProductsFromServer(true)}
        disabled={isLoadingMore || isLoading}
        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-slate-700 text-sm font-medium rounded-lg hover:border-brand-500 hover:text-brand-600 hover:shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingMore ? (
          <><Loader2 size={16} className="animate-spin text-brand-500" /> Đang tải...</>
        ) : (
          <>
            Xem thêm <ArrowDown size={14} />
          </>
        )}
      </button>
    </div>
)}
                  </>
                ) : (
                  <div className="text-center py-20 md:py-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                      <Search size={24} className="md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">Không tìm thấy sản phẩm</h3>
                    <p className="text-slate-500 text-xs md:text-sm mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                    <button onClick={resetFilters} className="text-brand-600 font-bold text-sm hover:underline flex items-center justify-center gap-2 mx-auto">
                      <RefreshCcw size={14} /> Xóa toàn bộ bộ lọc
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* BOTTOM CONTENT */}
        {currentCategory?.bottomContent && (
          <div className="mt-12 md:mt-20">
            <div className="relative bg-slate-50 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-slate-200 overflow-hidden">
              <div className="absolute top-0 right-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none"><Info size={200} className="md:w-[400px] md:h-[400px]" /></div>
              <div className="flex flex-col lg:flex-row gap-8 md:gap-12 relative z-10">
                 <div className="lg:w-1/4 flex-shrink-0 space-y-4 md:space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-2 text-brand-600 font-bold mb-2 md:mb-3 bg-brand-50 px-3 py-1 rounded-full text-[10px] md:text-xs uppercase tracking-wider">
                           <Info size={12} /> Thông tin hữu ích
                        </div>
                        <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2">Tìm hiểu về {currentCategory.name}</h3>
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Kiến thức chuyên sâu giúp bạn lựa chọn vật liệu phù hợp.</p>
                    </div>
                    <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><HelpCircle size={16} className="text-brand-500" /> Cần tư vấn thêm?</h4>
                        <p className="text-[10px] md:text-xs text-slate-500 mb-3 md:mb-4">Đội ngũ kỹ thuật Đại Nam luôn sẵn sàng hỗ trợ 24/7.</p>
                        <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">Chat Zalo Ngay</button>
                    </div>
                 </div>
                 <div className="lg:w-3/4">
                    <div className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-brand-600 prose-a:font-bold hover:prose-a:text-brand-700 prose-img:rounded-xl prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: currentCategory.bottomContent }} />
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}