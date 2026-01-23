import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, CheckCircle, ArrowRight, Star, PenTool, LayoutTemplate } from 'lucide-react';
import { getProducts, getCategories } from '../services/wpService';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductComponents';
import { Button } from '../components/common/UI';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
       const prods = await getProducts();
       setFeaturedProducts(prods.slice(0, 4));
       const cats = await getCategories();
       setCategories(cats);
    };
    loadData();
  }, []);

  return (
    <div className="animate-fade-in bg-white">
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" 
            alt="Đại Nam Wall Luxury Interior" 
            className="w-full h-full object-cover animate-pan-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-200 text-xs font-bold uppercase tracking-widest shadow-lg">
               <Star size={12} className="text-brand-400 fill-brand-400" />
               Vật liệu xanh & Bền vững
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] drop-shadow-xl">
              Kiến tạo <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">Chuẩn mực sống mới.</span>
            </h1>
            <p className="text-xl text-slate-200 font-light max-w-xl leading-relaxed opacity-90">
              Hệ sinh thái tấm ốp tường Đại Nam Wall - Kết tinh của công nghệ Nano hiện đại và thẩm mỹ kiến trúc đương đại.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Button variant="primary" onClick={() => window.location.hash = '#/shop'} className="h-14 px-10 text-base shadow-brand-500/40 shadow-2xl hover:-translate-y-1 transition-transform">
                Khám Phá Bộ Sưu Tập
              </Button>
              <Button variant="outline" className="h-14 px-10 text-base bg-transparent text-white border-white/30 hover:bg-white hover:text-slate-900 backdrop-blur-sm transition-all">
                Dự Án Đã Thực Hiện
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
           <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
           </div>
        </div>
      </section>

      {/* 2. Bento Grid Features - Why Choose Us */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Tại Sao Chọn Đại Nam Wall?</h2>
            <p className="text-slate-500 text-lg">Chúng tôi không chỉ bán vật liệu, chúng tôi cung cấp giải pháp hoàn thiện không gian với tiêu chuẩn khắt khe nhất.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
             {/* Big Feature */}
             <div className="md:col-span-2 row-span-2 rounded-3xl overflow-hidden relative group shadow-lg">
                <img 
                   src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
                   alt="Living Room"
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                   <h3 className="text-3xl font-bold text-white mb-2">Không Gian Sang Trọng</h3>
                   <p className="text-slate-200">Nâng tầm giá trị ngôi nhà với các mẫu vân đá, vân gỗ chân thực đến 99%.</p>
                </div>
             </div>

             {/* Smaller Features */}
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                   <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Bảo Hành 15 Năm</h3>
                <p className="text-slate-500 text-sm">Cam kết độ bền màu và kết cấu vật liệu dài lâu.</p>
             </div>

             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                   <PenTool size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Thi Công Thần Tốc</h3>
                <p className="text-slate-500 text-sm">Lắp đặt nhanh gọn, sạch sẽ, có thể vào ở ngay trong ngày.</p>
             </div>
             
             {/* Wide Feature */}
             <div className="md:col-span-3 lg:col-span-1 bg-brand-900 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-700 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-white mb-6">
                      <LayoutTemplate size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Đa Dạng Mẫu Mã</h3>
                    <p className="text-brand-100 text-sm mb-6">Hơn 500+ mã màu và bề mặt texture khác nhau.</p>
                    <Link to="/shop" className="inline-flex items-center text-white font-bold text-sm hover:gap-2 transition-all">
                       Xem Catalog <ArrowRight size={16} className="ml-2" />
                    </Link>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Categories with Hover Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Dòng Sản Phẩm</h2>
            <Link to="/shop" className="hidden md:flex items-center text-brand-600 font-semibold hover:text-brand-800 transition-colors">
              Xem tất cả <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {categories.map((cat, idx) => (
                <Link key={cat.id} to={`/shop?cat=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                   <img 
                     src={cat.image} 
                     alt={cat.name} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                   <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">0{idx + 1}</p>
                      <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                      <div className="h-1 w-12 bg-brand-500 rounded-full mb-3 group-hover:w-20 transition-all"></div>
                      <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                        {cat.description}
                      </p>
                   </div>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 4. Parallax Break Section */}
      <section className="relative py-32 bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2000&auto=format&fit=crop')" }}>
         <div className="absolute inset-0 bg-slate-900/60" />
         <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <span className="text-brand-400 font-serif italic text-2xl mb-4 block">"The details are not the details. They make the design."</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Biến ngôi nhà thành tác phẩm nghệ thuật</h2>
            <Button variant="primary" className="bg-white text-slate-900 hover:bg-brand-50 border-none shadow-xl px-10 py-4 text-lg">
               Liên Hệ Tư Vấn Ngay
            </Button>
         </div>
      </section>

      {/* 5. Trending Products - Clean Grid */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Sản Phẩm Được Yêu Thích</h2>
               <div className="w-24 h-1 bg-brand-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {featuredProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
            </div>
            <div className="mt-16 text-center">
               <Button variant="outline" onClick={() => window.location.hash = '#/shop'} className="px-10 border-slate-300 text-slate-600 hover:border-slate-900 hover:text-slate-900">
                  Xem Toàn Bộ Sản Phẩm
               </Button>
            </div>
         </div>
      </section>
    </div>
  );
};