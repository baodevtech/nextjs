'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Tag, FileText, ShoppingBag } from 'lucide-react';
import { Product, BlogPost } from '@/types';
import { getProducts } from '@/services/wpService';
import { BLOG_POSTS } from '@/constants';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<{ products: Product[], blogs: BlogPost[] }>({ products: [], blogs: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';

    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], blogs: [] });
      return;
    }

    const lowerQ = query.toLowerCase();
    
    const matchedProducts = products.filter(p => 
      p.name.toLowerCase().includes(lowerQ) || 
      p.brand?.toLowerCase().includes(lowerQ) ||
      p.sku.toLowerCase().includes(lowerQ)
    ).slice(0, 4);

    const matchedBlogs = BLOG_POSTS.filter(b => 
      b.title.toLowerCase().includes(lowerQ) ||
      b.category.toLowerCase().includes(lowerQ)
    ).slice(0, 2);

    setResults({ products: matchedProducts, blogs: matchedBlogs });
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-xl animate-fade-in">
       <div className="max-w-4xl mx-auto w-full px-4 pt-8 pb-4 border-b border-gray-100">
          <div className="relative flex items-center">
             <Search className="absolute left-0 text-slate-400 w-6 h-6" />
             <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, mã màu, hoặc bài viết..." 
                className="w-full pl-12 pr-12 py-4 text-2xl  font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-300 text-slate-900 outline-none"
             />
             <button 
                onClick={onClose}
                className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500"
             >
                <X size={24} />
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
             
             {!query && (
                <div className="space-y-8 animate-slide-up">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Gợi ý tìm kiếm</h3>
                        <div className="flex flex-wrap gap-3">
                            {['Tấm ốp Nano', 'Lam sóng giả gỗ', 'PVC Vân đá', 'Thi công trọn gói', 'Báo giá 2024'].map(tag => (
                                <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 bg-gray-50 hover:bg-brand-50 hover:text-brand-600 rounded-full text-sm font-medium transition-colors border border-gray-100">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             )}

             {query && (results.products.length > 0 || results.blogs.length > 0) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
                     <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <ShoppingBag size={14}/> Sản phẩm ({results.products.length})
                        </h3>
                        {results.products.length > 0 ? (
                            <div className="space-y-4">
                                {results.products.map(p => (
                                    <Link key={p.id} href={`/product/${p.slug}`} onClick={onClose} className="flex gap-4 group p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                            <img src={p.image.sourceUrl} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">{p.name}</h4>
                                            <p className="text-xs text-slate-500 mb-1">{p.brand} • {p.sku}</p>
                                            <p className="text-sm font-bold text-brand-600">{p.price.formatted}</p>
                                        </div>
                                    </Link>
                                ))}
                                <Link href={`/shop?search=${query}`} onClick={onClose} className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:underline mt-2 px-3">
                                    Xem tất cả sản phẩm <ArrowRight size={14}/>
                                </Link>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">Không tìm thấy sản phẩm nào.</p>
                        )}
                     </div>

                     <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <FileText size={14}/> Bài viết ({results.blogs.length})
                        </h3>
                        {results.blogs.length > 0 ? (
                            <div className="space-y-4">
                                {results.blogs.map(b => (
                                    <Link key={b.id} href={`/blog/${b.slug}`} onClick={onClose} className="block group p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase bg-brand-50 text-brand-600 px-2 py-0.5 rounded">{b.category}</span>
                                            <span className="text-[10px] text-slate-400">{b.date}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">{b.title}</h4>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">Không tìm thấy bài viết nào.</p>
                        )}
                     </div>
                 </div>
             )}

             {query && results.products.length === 0 && results.blogs.length === 0 && (
                 <div className="text-center py-20">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                         <Search size={32} />
                     </div>
                     <p className="text-slate-900 font-bold">Không tìm thấy kết quả cho "{query}"</p>
                     <p className="text-slate-500 text-sm mt-2">Vui lòng thử lại với từ khóa khác.</p>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};