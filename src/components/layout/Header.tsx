
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, ShoppingBag, Search, X, ChevronDown, 
  Layers, Activity, Gem, Wrench, ArrowRight, 
  Leaf, Sparkles, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/common/UI';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '@/context/CartContext';

// --- MEGA MENU DATA ---
const MEGA_MENU_ITEMS = [
    {
        group: "Vật Liệu Chính",
        items: [
            { 
                title: "Tấm Ốp Nano", 
                slug: "nano", 
                desc: "Bề mặt phẳng mịn, vân gỗ tự nhiên.", 
                icon: Layers, 
                color: "text-blue-600 bg-blue-50" 
            },
            { 
                title: "Lam Sóng", 
                slug: "lam-song", 
                desc: "Tạo chiều sâu 3D cho không gian.", 
                icon: Activity, 
                color: "text-amber-600 bg-amber-50" 
            },
            { 
                title: "PVC Vân Đá", 
                slug: "pvc-stone", 
                desc: "Sang trọng, tráng gương đẳng cấp.", 
                icon: Gem, 
                color: "text-emerald-600 bg-emerald-50" 
            },
            { 
                title: "Cốt Than Tre", 
                slug: "nano", // Linking to nano/multi-purpose for demo
                desc: "Uốn cong nghệ thuật, an toàn E0.", 
                icon: Leaf, 
                color: "text-green-600 bg-green-50" 
            }
        ]
    },
    {
        group: "Hệ Thống Phụ Kiện",
        items: [
            { 
                title: "Phào Chỉ Decor", 
                slug: "accessories", 
                desc: "Phào PS/PU hoa văn tinh tế.", 
                icon: Sparkles, 
                color: "text-purple-600 bg-purple-50" 
            },
            { 
                title: "Nẹp & Keo", 
                slug: "accessories", 
                desc: "Nẹp Inox, keo dán chuyên dụng.", 
                icon: Wrench, 
                color: "text-slate-600 bg-slate-50" 
            }
        ]
    }
];

export const Header: React.FC = () => {
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

  return (
    <>
      {/* Top Bar - Ultra Minimal (Hidden on scroll for cleaner look) */}
      <div className={`bg-brand-900 text-white py-2 px-4 hidden md:block border-b border-white/5 transition-all duration-300 ${scrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em]">
          <p className="flex items-center gap-2 cursor-default hover:text-white transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Premium Wall Solutions Since 2014
          </p>
          <div className="flex gap-8">
            <a href="tel:0912345678" className="hover:text-white transition-colors">
                Hotline: 0912.345.678
            </a>
            <span>Showroom: Long Biên, Hà Nội</span>
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
            
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <button 
                className="p-2 -ml-2 hover:bg-slate-100 rounded-full lg:hidden text-slate-900 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Mở menu"
              >
                <Menu size={24} strokeWidth={2} />
              </button>
              
             <Link href="/" className="flex items-center gap-3 group">
                <img src="https://tamnhuagiada.com/wp-content/uploads/2024/11/logo-1374-hinh.png" alt="Logo Đại Nam Wall" className="w-20 h-auto md:w-18 md:h-auto"/>
              
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link 
                href="/" 
                className={`px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${isActive('/') ? 'text-brand-600 bg-slate-50 font-semibold' : 'text-slate-900 hover:text-brand-600 hover:bg-slate-50'}`}
              >
                Trang Chủ
              </Link>

              {/* MEGA MENU TRIGGER */}
              <div className="group static">
                  <Link 
                    href="/shop" 
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 group-hover:bg-slate-50 group-hover:text-slate-900 ${isActive('/shop') ? 'text-slate-900 bg-slate-50 font-semibold' : 'text-slate-900 hover:text-brand-600 hover:bg-sl'}`}
                  >
                    Sản Phẩm <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 opacity-50" />
                  </Link>

                  {/* FULL WIDTH MEGA MENU DROPDOWN */}
                  <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-slate-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                          <div className="grid grid-cols-12 gap-8">
                              
                              {/* Left: Material Categories */}
                              <div className="col-span-3 space-y-6 border-r border-slate-100 pr-6">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vật Liệu Chính</h4>
                                  <div className="space-y-2">
                                      {MEGA_MENU_ITEMS[0].items.map((item) => (
                                          <Link 
                                            key={item.title} 
                                            href={`/shop?cat=${item.slug}`}
                                            className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                          >
                                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover/item:scale-110 transition-transform`}>
                                                  <item.icon size={20} />
                                              </div>
                                              <div>
                                                  <h5 className="text-sm font-bold text-slate-900 group-hover/item:text-brand-600 transition-colors">{item.title}</h5>
                                                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium opacity-80">{item.desc}</p>
                                              </div>
                                          </Link>
                                      ))}
                                  </div>
                              </div>

                              {/* Middle: Accessories & Quick Links */}
                              <div className="col-span-3 space-y-6 border-r border-slate-100 pr-6 pl-2">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Phụ Kiện & Khác</h4>
                                  <div className="space-y-2">
                                      {MEGA_MENU_ITEMS[1].items.map((item) => (
                                          <Link 
                                            key={item.title} 
                                            href={`/shop?cat=${item.slug}`}
                                            className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                          >
                                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover/item:scale-110 transition-transform`}>
                                                  <item.icon size={20} />
                                              </div>
                                              <div>
                                                  <h5 className="text-sm font-bold text-slate-900 group-hover/item:text-brand-600 transition-colors">{item.title}</h5>
                                                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium opacity-80">{item.desc}</p>
                                              </div>
                                          </Link>
                                      ))}
                                  </div>
                                  <div className="pt-4 mt-4 border-t border-dashed border-slate-100">
                                      <Link href="/pricing" className="flex items-center justify-between text-sm font-bold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                          Bảng Giá Niêm Yết <ArrowRight size={14}/>
                                      </Link>
                                      <Link href="/applications" className="flex items-center justify-between text-sm font-bold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                          Ứng Dụng Thực Tế <ArrowRight size={14}/>
                                      </Link>
                                  </div>
                              </div>

                              {/* Right: Featured Card */}
                              <div className="col-span-6 pl-4">
                                  <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-900 group/card cursor-pointer">
                                      <img 
                                        src="https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop" 
                                        alt="Featured Collection" 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover/card:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                      <div className="absolute bottom-0 left-0 p-8">
                                          <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wider mb-3 shadow-lg">New Collection 2024</span>
                                          <h3 className="text-2xl font-serif font-bold text-white mb-2">Vẻ Đẹp Vượt Thời Gian</h3>
                                          <p className="text-slate-300 text-sm mb-6 max-w-sm line-clamp-2">Khám phá bộ sưu tập tấm ốp than tre tráng gương - Xu hướng nội thất mới nhất.</p>
                                          <Link href="/shop" className="inline-flex items-center gap-2 text-white font-bold text-sm hover:gap-4 transition-all">
                                              Xem Ngay <ArrowRight size={16}/>
                                          </Link>
                                      </div>
                                  </div>
                              </div>

                          </div>
                      </div>
                  </div>
              </div>

              {[
                  { name: 'Ứng Dụng', path: '/applications' },
                  { name: 'Báo Giá', path: '/pricing' },
                  { name: 'Dự Án', path: '/projects' },
                  { name: 'Tin Tức', path: '/blog' },
                  { name: 'Liên Hệ', path: '/contact' },
              ].map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path} 
                    className={`
                        px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300
                        ${isActive(link.path)
                            ? 'text-slate-900 bg-slate-50 font-semibold' 
                            : 'text-slate-900 hover:text-brand-600 hover:bg-slate-50'}
                    `}
                  >
                      {link.name}
                  </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
                title="Tìm kiếm"
              >
                <Search size={20} strokeWidth={2} />
              </button>
              
              <button 
                onClick={toggleCart}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all relative group"
                title="Giỏ hàng"
              >
                <ShoppingBag size={20} strokeWidth={2} />
                {itemsCount > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>
              
              <div className="hidden md:block">
                 <Link href="/checkout">
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
                    <button 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-full text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-5">
                    <button 
                        onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 text-sm font-medium mb-6 transition-colors"
                    >
                        <Search size={18} /> <span>Tìm kiếm sản phẩm...</span>
                    </button>
                    
                    <nav className="space-y-1">
                        <Link 
                            href="/"
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive('/') ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Trang Chủ
                        </Link>

                        <div className="py-2">
                            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sản Phẩm</p>
                            {MEGA_MENU_ITEMS.map(group => (
                                <React.Fragment key={group.group}>
                                    {group.items.map(item => (
                                        <Link 
                                            key={item.title}
                                            href={`/shop?cat=${item.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{item.title}</span>
                                        </Link>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        {['Ứng Dụng', 'Báo Giá', 'Dự Án', 'Tin Tức', 'Liên Hệ'].map((name) => {
                            const path = `/${name === 'Tin Tức' ? 'blog' : name === 'Báo Giá' ? 'pricing' : name === 'Ứng Dụng' ? 'applications' : name === 'Dự Án' ? 'projects' : 'contact'}`;
                            return (
                                <Link 
                                    key={path}
                                    href={path} 
                                    className={`
                                        flex items-center justify-between p-3 rounded-xl transition-all group
                                        ${isActive(path) ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-600 font-medium'}
                                    `}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="text-sm">{name}</span>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </Link>
                            )
                        })}
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
