'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, FileText, ShoppingBag, Briefcase, Loader2 } from 'lucide-react';
import { Product, BlogPost, Project } from '@/types';
import { getProducts, getAllPosts, getAllProjects } from '@/services/wpService';
import Image from 'next/image';

// Custom Hook: Debounce để tránh filter liên tục khi đang gõ phím
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300); // Trì hoãn 300ms
  
  // Gộp state để tránh re-render nhiều lần
  const [data, setData] = useState<{ products: Product[], blogs: BlogPost[], projects: Project[] }>({ products: [], blogs: [], projects: [] });
  const [isFetchingData, setIsFetchingData] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch dữ liệu song song 1 lần duy nhất
  useEffect(() => {
    let isMounted = true;
    if (isOpen && data.products.length === 0 && !isFetchingData) {
      setIsFetchingData(true);
      Promise.all([getProducts(), getAllPosts(), getAllProjects()])
        .then(([prods, blogs, projs]) => {
          if (isMounted) {
            setData({ products: prods || [], blogs: blogs || [], projects: projs || [] });
            setIsFetchingData(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsFetchingData(false);
        });
    }
    return () => { isMounted = false; };
  }, [isOpen]);

  // 2. Xử lý Scroll và Autofocus an toàn
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Tối ưu CLS/LCP: Chỉ tự động focus trên Desktop. 
      // Bật bàn phím ảo tự động trên Mobile sẽ làm tụt điểm Speed Index và gây giật layout.
      if (window.innerWidth > 768 && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } else {
      document.body.style.overflow = ''; // Trả về rỗng thay vì 'auto' để an toàn hơn
      setQuery(''); // Reset tìm kiếm khi đóng
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // 3. Tối ưu Filter bằng useMemo
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return { products: [], blogs: [], projects: [] };
    
    const lowerQ = debouncedQuery.toLowerCase();
    
    return {
      products: data.products.filter(p => 
        p.name.toLowerCase().includes(lowerQ) || p.sku?.toLowerCase().includes(lowerQ)
      ).slice(0, 3), // Giảm xuống 3 item để tối ưu DOM Size trên mobile
      
      blogs: data.blogs.filter(b => 
        b.title.toLowerCase().includes(lowerQ) || b.category?.toLowerCase().includes(lowerQ)
      ).slice(0, 3),
      
      projects: data.projects.filter(prj => 
        prj.title.toLowerCase().includes(lowerQ) || prj.category?.toLowerCase().includes(lowerQ)
      ).slice(0, 3)
    };
  }, [debouncedQuery, data]);

  if (!isOpen) return null;

  const isSearching = query !== debouncedQuery; // Trạng thái đang gõ phím (chờ debounce)
  const hasResults = results.products.length > 0 || results.blogs.length > 0 || results.projects.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-xl animate-fade-in content-visibility-auto">
       {/* HEADER SEARCH */}
       <div className="max-w-4xl mx-auto w-full px-4 pt-6 md:pt-8 pb-4 border-b border-gray-100 shrink-0">
          <div className="relative flex items-center">
             {isFetchingData || isSearching ? (
                 <Loader2 className="absolute left-0 text-brand-500 w-6 h-6 animate-spin" />
             ) : (
                 <Search className="absolute left-0 text-slate-400 w-6 h-6" />
             )}
             
             <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, dự án..." 
                className="w-full pl-10 pr-12 py-3 md:py-4 text-xl md:text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-300 text-slate-900 outline-none"
             />
             <button 
                onClick={onClose}
                aria-label="Đóng tìm kiếm"
                className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500"
             >
                <X size={24} />
             </button>
          </div>
       </div>

       {/* KẾT QUẢ TÌM KIẾM */}
       <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
             
             {/* SUGGESTIONS */}
             {!query && (
                <div className="space-y-6 animate-slide-up">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Gợi ý tìm kiếm</h3>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {['Tấm ốp Nano', 'Lam sóng', 'PVC Vân đá', 'Dự án Vincom', 'Báo giá'].map(tag => (
                                <button 
                                    key={tag} 
                                    onClick={() => setQuery(tag)} 
                                    className="px-4 py-2 bg-gray-50 hover:bg-brand-50 hover:text-brand-600 rounded-full text-sm font-medium transition-colors border border-gray-100"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             )}

             {/* RESULTS GRID */}
             {query && !isSearching && hasResults && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                     
                     {/* SẢN PHẨM */}
                     {results.products.length > 0 && (
                     <div>
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <ShoppingBag size={14}/> Sản phẩm ({results.products.length})
                        </h3>
                        <div className="space-y-3">
                            {results.products.map(p => (
                                <Link key={p.id} href={`/product/${p.slug}`} onClick={onClose} className="flex gap-3 group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0 relative bg-gray-100">
                                        <Image 
                                            src={p.image.sourceUrl || '/placeholder.jpg'} 
                                            alt={p.name} 
                                            fill
                                            sizes="56px"
                                            loading="lazy"
                                            className="object-cover" 
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">{p.name}</h4>
                                        <p className="text-[11px] text-slate-500">{p.sku}</p>
                                        <p className="text-xs font-bold text-brand-600 mt-0.5">{p.price.formatted}</p>
                                    </div>
                                </Link>
                            ))}
                            <Link href={`/shop?search=${query}`} onClick={onClose} className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline mt-2">
                                Xem tất cả sản phẩm <ArrowRight size={12}/>
                            </Link>
                        </div>
                     </div>
                     )}

                     {/* BÀI VIẾT */}
                     {results.blogs.length > 0 && (
                     <div>
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <FileText size={14}/> Bài viết ({results.blogs.length})
                        </h3>
                        <div className="space-y-3">
                            {results.blogs.map(b => (
                                <Link key={b.id} href={`/blog/${b.slug}`} onClick={onClose} className="block group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-bold uppercase bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded">{b.category}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">{b.title}</h4>
                                </Link>
                            ))}
                        </div>
                     </div>
                     )}

                     {/* DỰ ÁN */}
                     {results.projects.length > 0 && (
                     <div>
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <Briefcase size={14}/> Dự án ({results.projects.length})
                        </h3>
                        <div className="space-y-3">
                            {results.projects.map(prj => (
                                <Link key={prj.id} href={`/projects/${prj.slug}`} onClick={onClose} className="flex gap-3 group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0 relative bg-gray-100">
                                        <Image 
                                            src={prj.image || '/placeholder.jpg'} 
                                            alt={prj.title} 
                                            fill
                                            sizes="56px"
                                            loading="lazy"
                                            className="object-cover" 
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">{prj.title}</h4>
                                        <p className="text-[11px] text-slate-500 mt-1">{prj.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                     </div>
                     )}

                 </div>
             )}

             {/* EMPTY STATE */}
             {query && !isSearching && !hasResults && !isFetchingData && (
                 <div className="text-center py-16">
                     <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                         <Search size={24} />
                     </div>
                     <p className="text-slate-900 text-sm font-bold">Không tìm thấy kết quả cho "{query}"</p>
                     <p className="text-slate-500 text-xs mt-1">Vui lòng thử lại với từ khóa khác.</p>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};