'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, Search, Phone, X } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const { itemsCount, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper for active link class
  const getLinkClass = (path: string) => {
      const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
      return `text-sm font-semibold transition-colors py-2 border-b-2 ${
          isActive 
          ? 'text-brand-600 border-brand-600' 
          : 'text-slate-600 border-transparent hover:text-brand-600 hover:border-brand-600'
      }`;
  };

  return (
    <>
      <div className="bg-brand-900 text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium">
          <p>Chào mừng đến với Đại Nam Wall - Giải pháp ốp tường toàn diện</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> Hotline: 0912.345.678 (24/7)</span>
            <span>Showroom: 123 Đường ABC, Hà Nội</span>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-gray-200 py-2' : 'bg-white border-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-4">
              <button 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-md lg:hidden text-slate-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
              
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 relative flex items-center justify-center">
                   <div className="absolute inset-0 bg-brand-600 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                   <span className="relative text-white font-black text-2xl font-serif italic">N</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-bold text-brand-900 tracking-tight leading-none">
                    ĐẠI NAM <span className="text-brand-500">WALL</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:block">
                    Vững bền cùng năm tháng
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className={getLinkClass('/')}>Trang Chủ</Link>
              <Link href="/shop" className={getLinkClass('/shop')}>Sản Phẩm</Link>
              <Link href="/projects" className={getLinkClass('/projects')}>Dự Án</Link>
              <Link href="/blog" className={getLinkClass('/blog')}>Tin Tức</Link>
              <Link href="/about" className={getLinkClass('/about')}>Về Chúng Tôi</Link>
              <Link href="/contact" className={getLinkClass('/contact')}>Liên Hệ</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
                title="Tìm kiếm"
              >
                <Search size={20} />
              </button>
              <button 
                onClick={toggleCart}
                className="p-2 text-slate-500 hover:bg-gray-100 hover:text-brand-600 rounded-full transition-colors relative group"
                title="Giỏ hàng"
              >
                <ShoppingBag size={20} />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                    {itemsCount}
                  </span>
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

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
             <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
             <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl p-6 animate-slide-in-left">
                 <div className="flex justify-between items-center mb-8">
                     <span className="text-xl font-bold text-slate-900">Menu</span>
                     <button onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-slate-400"/></button>
                 </div>
                 <nav className="flex flex-col space-y-4">
                    <button 
                        onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-slate-500 font-medium mb-4"
                    >
                        <Search size={20} /> Tìm kiếm...
                    </button>
                    <Link href="/" className="text-slate-800 font-bold text-lg py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Trang Chủ</Link>
                    <Link href="/shop" className="text-slate-800 font-bold text-lg py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Sản Phẩm</Link>
                    <Link href="/projects" className="text-slate-800 font-bold text-lg py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Dự Án</Link>
                    <Link href="/blog" className="text-slate-800 font-bold text-lg py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Tin Tức & Sự Kiện</Link>
                    <Link href="/about" className="text-slate-800 font-bold text-lg py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Về Đại Nam</Link>
                    <Link href="/contact" className="text-slate-800 font-bold text-lg py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Liên Hệ</Link>
                 </nav>
                 <div className="mt-8">
                    <Link href="/checkout" onClick={() => setMobileMenuOpen(false)}>
                        <Button fullWidth>Yêu Cầu Báo Giá</Button>
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