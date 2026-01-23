import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/wpService';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductComponents';
import { useCart } from '../App';
import { 
    Search, ChevronDown, Check, LayoutGrid, List, Filter, 
    SlidersHorizontal, X, ArrowUpRight 
} from 'lucide-react';

// --- COMPONENTS ---

const Breadcrumb: React.FC<{ categoryName?: string }> = ({ categoryName }) => (
    <nav className="flex text-xs text-slate-500 mb-4 z-10 relative">
        <Link to="/" className="hover:text-brand-600 transition-colors">Trang chủ</Link>
        <span className="mx-2 text-slate-300">/</span>
        <Link to="/shop" className="hover:text-brand-600 transition-colors">Cửa hàng</Link>
        {categoryName && (
            <>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900 font-semibold">{categoryName}</span>
            </>
        )}
    </nav>
);

const ShopHeader: React.FC<{ category?: Category, productCount: number }> = ({ category, productCount }) => {
    // Default Header if no category selected
    if (!category) {
        return (
             <div className="mb-10 bg-gradient-to-r from-brand-50 to-white rounded-2xl p-8 md:p-12 border border-brand-100 relative overflow-hidden">
                <Breadcrumb />
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">
                        Tất Cả Sản Phẩm
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Khám phá bộ sưu tập vật liệu ốp tường cao cấp, được tuyển chọn kỹ lưỡng để mang lại vẻ đẹp bền vững cho ngôi nhà của bạn.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm text-xs font-bold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        {productCount} Sản phẩm sẵn sàng
                    </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>
        );
    }

    // Category Header with Image Background
    return (
        <div className="mb-10 rounded-2xl overflow-hidden relative min-h-[250px] flex flex-col justify-center">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src={category.headerImage || category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12 max-w-3xl">
                {/* Custom Breadcrumb for dark mode */}
                <nav className="flex text-xs text-slate-300 mb-4">
                    <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
                    <span className="mx-2 text-slate-500">/</span>
                    <Link to="/shop" className="hover:text-white transition-colors">Cửa hàng</Link>
                    <span className="mx-2 text-slate-500">/</span>
                    <span className="text-white font-semibold">{category.name}</span>
                </nav>

                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-sm">
                    {category.name}
                </h1>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl mb-6 font-light">
                    {category.description}
                </p>
                
                <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/10">
                        {productCount} Sản phẩm
                    </span>
                    <span className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg shadow-lg">
                        Bộ sưu tập 2026
                    </span>
                </div>
            </div>
        </div>
    );
};

const FilterSection: React.FC<{ 
    title: string, 
    isOpen?: boolean, 
    children: React.ReactNode 
}> = ({ title, isOpen = true, children }) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <div className="border-b border-gray-100 py-5">
            <button 
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-sm font-bold text-slate-900 mb-4"
            >
                {title}
                <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <div className="animate-fade-in">{children}</div>}
        </div>
    );
};

// --- MAIN PAGE ---

export const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const location = useLocation();
  const { addToCart } = useCart();

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
    setFilter(cat || 'all');
  }, [location]);

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.categories.includes(filter));

  const currentCategory = categories.find(c => c.slug === filter);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header Section */}
        <ShopHeader category={currentCategory} productCount={filteredProducts.length} />

        <div className="flex flex-col lg:flex-row gap-10">
            
          {/* SIDEBAR FILTERS (Desktop) */}
          <aside className={`
            lg:w-64 flex-shrink-0 
            ${showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}
          `}>
             <div className="flex items-center justify-between lg:hidden mb-6">
                <span className="text-lg font-bold">Bộ Lọc</span>
                <button onClick={() => setShowMobileFilters(false)}><X size={24}/></button>
             </div>

             <div className="sticky top-24 space-y-2">
                {/* Categories */}
                <FilterSection title="Danh Mục">
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filter === 'all' ? 'bg-slate-900 border-slate-900' : 'border-gray-300'}`}>
                                 {filter === 'all' && <Check size={10} className="text-white" />}
                             </div>
                             <input type="radio" name="cat" className="hidden" checked={filter === 'all'} onChange={() => setFilter('all')} />
                             <span className={`text-sm ${filter === 'all' ? 'font-bold text-slate-900' : 'text-slate-600'}`}>Tất cả</span>
                        </label>
                        {categories.map(cat => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded -ml-1">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filter === cat.slug ? 'bg-slate-900 border-slate-900' : 'border-gray-300'}`}>
                                    {filter === cat.slug && <Check size={10} className="text-white" />}
                                </div>
                                <input type="radio" name="cat" className="hidden" checked={filter === cat.slug} onChange={() => setFilter(cat.slug)} />
                                <span className={`text-sm flex-1 ${filter === cat.slug ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Price Range (Mock) */}
                <FilterSection title="Khoảng Giá">
                    <div className="space-y-4 px-1">
                        <div className="h-1 bg-gray-200 rounded-full relative">
                            <div className="absolute left-0 w-1/2 h-full bg-slate-900 rounded-full"></div>
                            <div className="absolute left-1/2 w-4 h-4 bg-white border-2 border-slate-900 rounded-full -top-1.5 shadow cursor-pointer"></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>0đ</span>
                            <span>500.000đ+</span>
                        </div>
                    </div>
                </FilterSection>

                {/* Status (Mock) */}
                <FilterSection title="Trạng Thái">
                     <label className="flex items-center gap-3 cursor-pointer mb-2">
                        <input type="checkbox" className="rounded border-gray-300 text-slate-900 focus:ring-slate-900" defaultChecked />
                        <span className="text-sm text-slate-600">Còn hàng</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-slate-900 focus:ring-slate-900" />
                        <span className="text-sm text-slate-600">Khuyến mãi</span>
                     </label>
                </FilterSection>
             </div>
          </aside>

          {/* PRODUCT GRID AREA */}
          <div className="flex-1">
             {/* Toolbar */}
             <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <button 
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-slate-700"
                >
                    <Filter size={16} /> Bộ Lọc
                </button>

                <div className="hidden md:flex items-center gap-2">
                    {['Bán chạy nhất', 'Giá thấp - cao', 'Giá cao - thấp', 'Mới nhất'].map((sort, i) => (
                        <button key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
                            {sort}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-slate-500 mr-2">Hiển thị:</span>
                    <button className="p-2 bg-gray-100 text-slate-900 rounded-md hover:bg-gray-200"><LayoutGrid size={18}/></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600"><List size={18}/></button>
                </div>
             </div>

             {/* Grid */}
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

             {/* Empty State */}
             {!loading && filteredProducts.length === 0 && (
                 <div className="text-center py-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                        <Search size={32} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-1">Không tìm thấy sản phẩm</h3>
                     <p className="text-slate-500 text-sm mb-6">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.</p>
                     <button onClick={() => setFilter('all')} className="text-brand-600 font-bold text-sm hover:underline">
                         Xóa bộ lọc
                     </button>
                 </div>
             )}
          </div>
        </div>

        {/* SEO / Bottom Content Section */}
        {currentCategory?.bottomContent && (
            <div className="mt-24 border-t border-gray-100 pt-16">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Thông tin danh mục</h3>
                        <p className="text-sm text-slate-500">Tìm hiểu thêm về đặc tính kỹ thuật và ứng dụng.</p>
                    </div>
                    <div className="md:w-3/4">
                        <div 
                            className="prose prose-slate max-w-none prose-headings:font-serif prose-a:text-brand-600 prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: currentCategory.bottomContent }} 
                        />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};