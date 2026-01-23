import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Ruler, Layers, ShieldCheck, Tag } from 'lucide-react';
import { getProductBySlug } from '../services/wpService';
import { Product } from '../types';
import { Button } from '../components/common/UI';
import { MaterialCalculator, AIAssistant } from '../components/product/ProductComponents';
import { useCart } from '../App';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then(p => setProduct(p || null));
      setActiveImage(0);
    }
  }, [slug]);

  if (!product) return <div className="pt-32 text-center text-gray-500 min-h-screen">Đang tải sản phẩm...</div>;

  const allImages = [product.image, ...product.galleryImages];

  return (
    <div className="bg-white min-h-screen pb-20">
       {/* Breadcrumb */}
       <div className="bg-slate-50 border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-sm text-slate-500 flex items-center gap-2">
             <Link to="/" className="hover:text-brand-600">Trang chủ</Link>
             <ChevronRight size={14} />
             <Link to="/shop" className="hover:text-brand-600">Sản phẩm</Link>
             <ChevronRight size={14} />
             <span className="text-slate-900 font-medium truncate">{product.name}</span>
          </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group">
              <img 
                src={allImages[activeImage]?.sourceUrl} 
                alt={allImages[activeImage]?.altText} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="grid grid-cols-5 gap-3">
               {allImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? 'border-brand-600 opacity-100 ring-2 ring-brand-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img.sourceUrl} alt={img.altText} className="w-full h-full object-cover" />
                  </button>
               ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-1 bg-brand-50 text-brand-700 text-[10px] font-extrabold uppercase tracking-widest rounded border border-brand-100 flex items-center gap-1">
                  <Tag size={10} /> {product.brand || 'Đại Nam Premium'}
               </span>
               {product.stockStatus === 'IN_STOCK' && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded border border-green-100">
                     Sẵn kho
                  </span>
               )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
            <p className="text-sm text-slate-500 mb-4 font-mono">Mã SP: {product.sku}</p>

            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
               <p className="text-3xl font-bold text-brand-700">{product.price.formatted}</p>
               <span className="mb-1 text-sm text-slate-400 font-medium line-through">
                  {(product.price.amount * 1.2).toLocaleString('vi-VN')}₫
               </span>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                 <Ruler className="text-brand-500 mt-1" size={20} />
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-bold">Kích thước</p>
                   <p className="font-semibold text-slate-800">{product.dimensions.width} x {product.dimensions.length} mm</p>
                 </div>
               </div>
               <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                 <Layers className="text-brand-500 mt-1" size={20} />
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-bold">Độ dày</p>
                   <p className="font-semibold text-slate-800">{product.dimensions.thickness} mm</p>
                 </div>
               </div>
            </div>

            <div 
              className="prose prose-sm prose-slate text-slate-600 mb-8" 
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <Button 
                  onClick={() => addToCart(product)} 
                  disabled={product.stockStatus === 'OUT_OF_STOCK'}
                  className="flex-1 py-4 text-base shadow-brand-500/30 shadow-lg"
               >
                Thêm Vào Giỏ
               </Button>
               <Button variant="secondary" className="flex-1 py-4">
                 Tư Vấn Zalo
               </Button>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium text-slate-500 mb-8">
                <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-brand-500"/> Bảo hành 15 năm</span>
                <span className="flex items-center gap-1"><Layers size={16} className="text-brand-500"/> Công nghệ Nano</span>
            </div>

            {/* Tools */}
            {product.dimensions.area > 0 && <MaterialCalculator product={product} onAdd={(qty) => addToCart(product, qty)} />}
            <AIAssistant product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};