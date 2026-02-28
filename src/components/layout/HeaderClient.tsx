// src/components/layout/HeaderClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, ShoppingBag, Search, X, ChevronDown, 
  Layers, Activity, Gem, Wrench, ArrowRight, 
  Leaf, Sparkles, ChevronRight, Box
} from 'lucide-react';
import { Button } from '@/components/common/UI';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '@/context/CartContext';
import { HeaderData } from '@/types';

const IconMap: Record<string, React.ElementType> = {
  Layers, Activity, Gem, Wrench, Leaf, Sparkles, Box
};

// [TỐI ƯU] Hàm bọc an toàn để sửa lỗi dính tiền tố thư mục (VD: /product/du-an)
const safeLink = (url?: string) => {
  if (!url) return "/";
  if (url.startsWith("http") || url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("#")) return url;
  return url.startsWith("/") ? url : `/${url}`;
};

interface HeaderClientProps {
  headerData: HeaderData;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ headerData }) => {
  const { itemsCount, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;
  
  const { megaMenu } = headerData;

  return (
    <>
      <div className={`bg-brand-900 text-white py-2 px-4 hidden md:block border-b border-white/5 transition-all duration-300 ${scrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em]">
          <p className="flex items-center gap-2 cursor-default hover:text-white transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {headerData.topBarText || "Premium Wall Solutions Since 2014"}
          </p>
          <div className="flex gap-8">
            <a href={`tel:${headerData.hotline?.replace(/\D/g, '') || '0912345678'}`} className="hover:text-white transition-colors">
                Hotline: {headerData.hotline || "0912.345.678"}
            </a>
            <span>Showroom: Quận 12, Hồ Chí Minh</span>
          </div>
        </div>
      </div>

      <header 
        className={`
            sticky top-0 left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${scrolled 
                ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm' 
                : 'bg-white border-b border-transparent py-3'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-4">
              <button 
                className="p-2 -ml-2 hover:bg-slate-100 rounded-full lg:hidden text-slate-900 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Mở menu"
              >
                <Menu size={24} strokeWidth={2} />
              </button>
              
             <Link href="/" className="flex items-center gap-3 group">
                <img src={headerData.logo || "https://tamnhuagiada.com/wp-content/uploads/2024/11/logo-1374-hinh.png"} alt="Logo Đại Nam Wall" className="w-20 h-auto md:w-18 md:h-auto"/>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className={`px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${isActive('/') ? 'text-brand-600 bg-slate-50 font-semibold' : 'text-slate-900 hover:text-brand-600 hover:bg-slate-50'}`}>
                Trang Chủ
              </Link>

              <div className="group static">
                  <Link href="/shop" className={`flex items-center gap-1 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 group-hover:bg-slate-50 group-hover:text-slate-900 ${isActive('/shop') ? 'text-slate-900 bg-slate-50 font-semibold' : 'text-slate-900 hover:text-brand-600 hover:bg-sl'}`}>
                    Sản Phẩm <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 opacity-50" />
                  </Link>

                  <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-slate-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                          <div className="grid grid-cols-12 gap-8">
                              
                              <div className="col-span-3 space-y-6 border-r border-slate-100 pr-6">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                      {megaMenu.col1?.title || "Vật Liệu Chính"}
                                  </h4>
                                  <div className="space-y-2">
                                      {megaMenu.col1?.items?.map((item) => {
                                          const DynamicIcon = IconMap[item.icon] || IconMap['Box'];
                                          return (
                                              <Link key={item.title} href={`/shop?cat=${item.slug}`} className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover/item:scale-110 transition-transform`}>
                                                      <DynamicIcon size={20} />
                                                  </div>
                                                  <div>
                                                      <h5 className="text-sm font-bold text-slate-900 group-hover/item:text-brand-600 transition-colors">{item.title}</h5>
                                                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium opacity-80">{item.desc}</p>
                                                  </div>
                                              </Link>
                                          );
                                      })}
                                  </div>
                              </div>

                              <div className="col-span-3 space-y-6 border-r border-slate-100 pr-6 pl-2">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                      {megaMenu.col2?.title || "Phụ Kiện & Khác"}
                                  </h4>
                                  <div className="space-y-2">
                                      {megaMenu.col2?.items?.map((item) => {
                                          const DynamicIcon = IconMap[item.icon] || IconMap['Box'];
                                          return (
                                              <Link key={item.title} href={`/shop?cat=${item.slug}`} className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover/item:scale-110 transition-transform`}>
                                                      <DynamicIcon size={20} />
                                                  </div>
                                                  <div>
                                                      <h5 className="text-sm font-bold text-slate-900 group-hover/item:text-brand-600 transition-colors">{item.title}</h5>
                                                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium opacity-80">{item.desc}</p>
                                                  </div>
                                              </Link>
                                          );
                                      })}
                                  </div>

                                  {megaMenu.quickLinks && megaMenu.quickLinks.length > 0 && (
                                      <div className="pt-4 mt-4 border-t border-dashed border-slate-100 space-y-1">
                                          {megaMenu.quickLinks.map((ql, idx) => (
                                              <Link key={idx} href={safeLink(ql.link)} className="flex items-center justify-between text-sm font-bold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                                  {ql.title} <ArrowRight size={14}/>
                                              </Link>
                                          ))}
                                      </div>
                                  )}
                              </div>

                              <div className="col-span-6 pl-4">
                                  <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-900 group/card cursor-pointer">
                                      <img 
                                        src={megaMenu.banner?.image || "https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop"} 
                                        alt={megaMenu.banner?.title || "Banner"} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover/card:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                      <div className="absolute bottom-0 left-0 p-8">
                                          {megaMenu.banner?.badge && (
                                              <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wider mb-3 shadow-lg">
                                                  {megaMenu.banner.badge}
                                              </span>
                                          )}
                                          <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                              {megaMenu.banner?.title || "Vẻ Đẹp Vượt Thời Gian"}
                                          </h3>
                                          <p className="text-slate-300 text-sm mb-6 max-w-sm line-clamp-2">
                                              {megaMenu.banner?.desc || "Khám phá bộ sưu tập tấm ốp than tre tráng gương."}
                                          </p>
                                          <Link href={safeLink(megaMenu.banner?.linkUrl || "/shop")} className="inline-flex items-center gap-2 text-white font-bold text-sm hover:gap-4 transition-all">
                                              {megaMenu.banner?.linkText || "Xem Ngay"} <ArrowRight size={16}/>
                                          </Link>
                                      </div>
                                  </div>
                              </div>

                          </div>
                      </div>
                  </div>
              </div>

              {headerData.navItems && headerData.navItems.length > 0 ? (
                headerData.navItems.map((link) => (
                  <Link key={link.link} href={safeLink(link.link)} className={`px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${isActive(safeLink(link.link)) ? 'text-slate-900 bg-slate-50 font-semibold' : 'text-slate-900 hover:text-brand-600 hover:bg-slate-50'}`}>
                      {link.title}
                  </Link>
                ))
              ) : (
                ['Ứng Dụng', 'Báo Giá', 'Dự Án', 'Tin Tức', 'Liên Hệ'].map((name) => {
                  const path = `/${name === 'Tin Tức' ? 'blog' : name === 'Báo Giá' ? 'pricing' : name === 'Ứng Dụng' ? 'applications' : name === 'Dự Án' ? 'projects' : 'contact'}`;
                  return (
                      <Link key={path} href={path} className={`px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${isActive(path) ? 'text-slate-900 bg-slate-50 font-semibold' : 'text-slate-900 hover:text-brand-600 hover:bg-slate-50'}`}>
                          {name}
                      </Link>
                  )
                })
              )}
            </nav>

            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all" title="Tìm kiếm">
                <Search size={20} strokeWidth={2} />
              </button>
              <button onClick={toggleCart} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all relative group" title="Giỏ hàng">
                <ShoppingBag size={20} strokeWidth={2} />
                {itemsCount > 0 && <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
              </button>
              <div className="hidden md:block">
                 <Link href="/pricing">
                    <Button variant="primary" className="py-2 px-4 text-xs shadow-brand-500/30 shadow-lg">Báo Giá Ngay</Button>
                 </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
             <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
             <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-slide-in-left flex flex-col">
                 <div className="p-5 flex justify-between items-center border-b border-slate-100">
                    <span className="text-lg font-bold text-slate-900">Menu</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                        <X size={20} />
                    </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-5">
                    <button onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 text-sm font-medium mb-6 transition-colors">
                        <Search size={18} /> <span>Tìm kiếm sản phẩm...</span>
                    </button>
                    
                    <nav className="space-y-1">
                        <Link href="/" className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive('/') ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-600 font-medium'}`} onClick={() => setMobileMenuOpen(false)}>
                            Trang Chủ
                        </Link>

                        <div className="py-2">
                            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sản Phẩm</p>
                            
                            {[megaMenu.col1, megaMenu.col2].map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    {group?.items?.map((item) => {
                                        const DynamicIcon = IconMap[item.icon] || IconMap['Box'];
                                        return (
                                            <Link key={item.title} href={`/shop?cat=${item.slug}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                                                    <DynamicIcon size={16} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </React.Fragment>
                            ))}

                            {megaMenu.quickLinks && megaMenu.quickLinks.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                    {megaMenu.quickLinks.map((ql, idx) => (
                                        <Link key={`ql-${idx}`} href={safeLink(ql.link)} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                            <span className="text-sm font-bold text-slate-700">{ql.title}</span>
                                            <ChevronRight size={16} className="text-slate-300" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {headerData.navItems && headerData.navItems.length > 0 ? (
                            headerData.navItems.map((link) => (
                                <Link key={link.link} href={safeLink(link.link)} className={`flex items-center justify-between p-3 rounded-xl transition-all group ${isActive(safeLink(link.link)) ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-600 font-medium'}`} onClick={() => setMobileMenuOpen(false)}>
                                    <span className="text-sm">{link.title}</span>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </Link>
                            ))
                        ) : (
                           ['Ứng Dụng', 'Báo Giá', 'Dự Án', 'Tin Tức', 'Liên Hệ'].map((name) => {
                                const path = `/${name === 'Tin Tức' ? 'blog' : name === 'Báo Giá' ? 'pricing' : name === 'Ứng Dụng' ? 'applications' : name === 'Dự Án' ? 'projects' : 'contact'}`;
                                return (
                                    <Link key={path} href={path} className={`flex items-center justify-between p-3 rounded-xl transition-all group ${isActive(path) ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-600 font-medium'}`} onClick={() => setMobileMenuOpen(false)}>
                                        <span className="text-sm">{name}</span>
                                        <ChevronRight size={16} className="text-slate-300" />
                                    </Link>
                                )
                           })
                        )}
                    </nav>
                 </div>
                 
                 <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <Link href="/checkout" onClick={() => setMobileMenuOpen(false)}>
                        <Button fullWidth className="h-11 text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20">Nhận Báo Giá</Button>
                    </Link>
                 </div>
             </div>
          </div>
        )}
      </header>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};