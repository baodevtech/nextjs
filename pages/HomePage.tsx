import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, ArrowRight, Star, PenTool, LayoutTemplate, ChevronRight, Quote, PlayCircle } from 'lucide-react';
import { getProducts, getCategories } from '../services/wpService';
import { Product, Category, BlogPost } from '../../types';
import { BLOG_POSTS } from '../constants';
import { ProductCard } from '../../components/product/ProductComponents';
import { Button } from '../../components/common/UI';
import { useCart } from '../../App';

// --- SUB-COMPONENTS FOR CLEANER CODE ---

const SectionTitle: React.FC<{ subtitle: string, title: string, center?: boolean, light?: boolean }> = ({ subtitle, title, center, light }) => (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
        <span className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 block ${light ? 'text-amber-400' : 'text-brand-600'}`}>
            {subtitle}
        </span>
        <h2 className={`text-3xl md:text-5xl font-serif font-bold ${light ? 'text-white' : 'text-slate-900'}`}>
            {title}
        </h2>
    </div>
);

const TrustBar = () => (
    <div className="bg-slate-900 border-b border-slate-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Mock Partner Logos - Text based for now */}
             <span className="text-xl font-serif font-bold italic">Vingroup</span>
             <span className="text-xl font-serif font-bold italic">Sun Group</span>
             <span className="text-xl font-serif font-bold italic">Masterise Homes</span>
             <span className="text-xl font-serif font-bold italic">Novaland</span>
             <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                <Star size={14} fill="currentColor"/> Top 10 Sao Vàng Đất Việt
             </div>
        </div>
    </div>
);

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'premium'>('bestseller');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
       const prods = await getProducts();
       setProducts(prods);
       const cats = await getCategories();
       setCategories(cats);
    };
    loadData();
  }, []);

  // Filter products based on active tab (Mock logic)
  const displayedProducts = React.useMemo(() => {
      if (activeTab === 'new') return products.slice(0, 4).reverse();
      if (activeTab === 'premium') return products.filter(p => p.price.amount > 200000).slice(0, 4);
      return products.slice(0, 4); // bestseller default
  }, [products, activeTab]);

  return (
    <div className="animate-fade-in bg-white font-sans">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" 
                alt="Luxury Wall Panels" 
                className="w-full h-full object-cover animate-pan-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-6 animate-slide-up">
                    <Star size={12} fill="currentColor" /> Premium Interior Materials
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] mb-8 animate-slide-up drop-shadow-2xl" style={{ animationDelay: '0.1s' }}>
                    Kiến tạo <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100">Chuẩn mực sống.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 font-light max-w-xl leading-relaxed mb-10 animate-slide-up opacity-90" style={{ animationDelay: '0.2s' }}>
                    Hệ sinh thái tấm ốp tường Đại Nam Wall - Kết tinh của công nghệ Nano hiện đại và thẩm mỹ kiến trúc đương đại.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <Button variant="primary" onClick={() => window.location.hash = '#/shop'} className="h-14 px-10 text-sm font-bold uppercase tracking-widest bg-white text-slate-900 hover:bg-brand-50 border-none shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        Xem Bộ Sưu Tập
                    </Button>
                    <Link to="/projects" className="h-14 px-10 flex items-center justify-center text-sm font-bold uppercase tracking-widest text-white border border-white/30 hover:bg-white hover:text-slate-900 transition-all rounded-lg backdrop-blur-sm group">
                        <PlayCircle size={20} className="mr-2 group-hover:text-brand-600 transition-colors" /> Dự Án Thực Tế
                    </Link>
                </div>
            </div>
        </div>
      </section>

      <TrustBar />

      {/* 2. CURATED COLLECTIONS (Masonry Grid Style) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Our Collections</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Danh Mục Nổi Bật</h2>
                </div>
                <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors border-b border-slate-200 hover:border-brand-600 pb-1">
                    Xem tất cả danh mục <ArrowRight size={16}/>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[500px]">
                {/* Large Item */}
                {categories[0] && (
                    <Link to={`/shop?cat=${categories[0].slug}`} className="group md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl cursor-pointer">
                        <img src={categories[0].headerImage || categories[0].image} alt={categories[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">Best Seller</span>
                            <h3 className="text-3xl font-serif font-bold mb-2">{categories[0].name}</h3>
                            <p className="text-sm text-slate-300 max-w-xs line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">{categories[0].description}</p>
                            <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:border-amber-400 group-hover:text-amber-400 transition-colors">Khám phá <ChevronRight size={14}/></span>
                        </div>
                    </Link>
                )}

                {/* Smaller Items */}
                {categories.slice(1, 3).map((cat) => (
                    <Link key={cat.id} to={`/shop?cat=${cat.slug}`} className="group md:col-span-2 relative overflow-hidden rounded-2xl cursor-pointer">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                            <h3 className="text-2xl font-serif font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                            <span className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.count} Sản phẩm</span>
                        </div>
                    </Link>
                ))}
                
                 {/* Last Item or CTA */}
                 <Link to="/shop" className="group md:col-span-2 bg-slate-100 relative overflow-hidden rounded-2xl cursor-pointer flex items-center justify-center border border-slate-200 hover:border-brand-200 transition-colors">
                     <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900 shadow-sm group-hover:scale-110 transition-transform">
                            <ArrowRight size={20}/>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Xem Toàn Bộ <br/> Catalog 2024</h3>
                     </div>
                 </Link>
            </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (With Tabs) */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <SectionTitle 
                    center 
                    subtitle="Selected for you" 
                    title="Sản Phẩm Tinh Hoa" 
                />
                
                {/* Tabs */}
                <div className="inline-flex p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setActiveTab('bestseller')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'bestseller' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Bán Chạy Nhất
                    </button>
                    <button 
                        onClick={() => setActiveTab('new')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Mới Ra Mắt
                    </button>
                    <button 
                        onClick={() => setActiveTab('premium')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'premium' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Dòng Cao Cấp
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onQuickAdd={() => addToCart(product)}
                    />
                ))}
            </div>
            
            <div className="mt-16 text-center">
                <Button variant="outline" onClick={() => window.location.hash = '#/shop'} className="px-12 py-4 h-auto text-sm uppercase tracking-widest border-slate-300 hover:border-slate-900">
                    Khám Phá Cửa Hàng
                </Button>
            </div>
         </div>
      </section>

      {/* 4. REAL PROJECTS (Dark Mode Inspiration) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-900/30 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-end mb-16">
                <div>
                     <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Real Projects</span>
                     <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Cảm Hứng Không Gian</h2>
                </div>
                <Link to="/projects" className="hidden md:flex items-center gap-2 text-sm font-bold text-white hover:text-amber-500 transition-colors">
                    Xem thư viện dự án <ArrowRight size={16}/>
                </Link>
            </div>

            {/* Project Showcase - Horizontal Scroll Snap on Mobile */}
            <div className="flex overflow-x-auto pb-8 gap-6 snap-x no-scrollbar md:grid md:grid-cols-3 md:overflow-visible">
                {/* Project Card 1 */}
                <div className="snap-center shrink-0 w-[85vw] md:w-auto group cursor-pointer">
                    <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl relative mb-4">
                        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt="Penthouse" />
                        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Penthouse Ecopark</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">Phòng Khách Luxury</h3>
                    <p className="text-sm text-slate-400">Sử dụng: Nano Vân Gỗ Óc Chó + Lam Sóng</p>
                </div>

                {/* Project Card 2 */}
                <div className="snap-center shrink-0 w-[85vw] md:w-auto group cursor-pointer md:mt-12">
                     <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl relative mb-4">
                        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt="Hotel Lobby" />
                        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Metropole Lobby</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">Sảnh Khách Sạn 5*</h3>
                    <p className="text-sm text-slate-400">Sử dụng: PVC Vân Đá Đối Xứng (Bookmatch)</p>
                </div>

                {/* Project Card 3 */}
                <div className="snap-center shrink-0 w-[85vw] md:w-auto group cursor-pointer">
                     <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl relative mb-4">
                        <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt="Villa" />
                         <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Riverside Villa</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">Phòng Ngủ Master</h3>
                    <p className="text-sm text-slate-400">Sử dụng: Cốt Than Tre Uốn Cong</p>
                </div>
            </div>
         </div>
      </section>

      {/* 5. TESTIMONIALS (Social Proof) */}
      <section className="py-24 bg-white relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle center subtitle="Testimonials" title="Khách Hàng Nói Gì Về Chúng Tôi?" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-slate-50 p-8 rounded-2xl relative border border-slate-100 hover:shadow-lg transition-shadow">
                        <Quote size={40} className="text-brand-200 mb-6" />
                        <p className="text-slate-600 italic mb-6 leading-relaxed">
                            "Tôi thực sự ấn tượng với chất lượng tấm ốp Nano của Đại Nam. Vân gỗ rất thật, sờ vào cảm giác chắc chắn. Đội ngũ thi công làm việc rất sạch sẽ và nhanh gọn."
                        </p>
                        <div className="flex items-center gap-4">
                            <img src={`https://ui-avatars.com/api/?name=User+${item}&background=0284c7&color=fff`} alt="User" className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Anh Minh Tuấn</p>
                                <p className="text-xs text-slate-500 uppercase">Chủ căn hộ Vinhomes Ocean Park</p>
                            </div>
                        </div>
                        <div className="absolute top-8 right-8 flex text-amber-400">
                            {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* 6. BLOG & NEWS */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
                <SectionTitle subtitle="Design Journal" title="Tin Tức & Xu Hướng" />
                <Link to="/blog" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors border-b border-slate-200 hover:border-brand-600 pb-1 mb-12">
                    Đọc thêm bài viết <ArrowRight size={16}/>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {BLOG_POSTS.slice(0, 3).map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                        <div className="aspect-[16/9] overflow-hidden rounded-xl mb-4 relative">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 rounded-sm">
                                {post.category}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                            Đọc tiếp <ArrowRight size={14}/>
                        </span>
                    </Link>
                ))}
            </div>
         </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-32 bg-slate-900 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                  Sẵn Sàng Thay Đổi <br/> Không Gian Sống?
              </h2>
              <p className="text-slate-400 text-lg mb-10 font-light max-w-2xl mx-auto">
                  Liên hệ với chuyên gia của Đại Nam Wall để nhận tư vấn giải pháp và báo giá chi tiết cho công trình của bạn.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link to="/contact">
                       <Button className="h-16 px-12 text-sm font-bold uppercase tracking-widest bg-amber-400 text-slate-900 hover:bg-white border-none shadow-[0_0_30px_rgba(251,191,36,0.4)]">
                          Nhận Báo Giá Ngay
                       </Button>
                  </Link>
                  <Link to="/shop">
                       <Button variant="outline" className="h-16 px-12 text-sm font-bold uppercase tracking-widest border-slate-700 text-white hover:bg-slate-800 hover:text-white hover:border-white">
                          Xem Catalog Online
                       </Button>
                  </Link>
              </div>
          </div>
      </section>

    </div>
  );
};