// src/components/layout/MobileMenu.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, ChevronDown, ChevronRight, ArrowRight, Box, Layers, Activity, Gem, Wrench, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { HeaderData } from '@/types';
import Image from 'next/image';

const IconMap: Record<string, React.ElementType> = {
  Layers, Activity, Gem, Wrench, Leaf, Sparkles, Box
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  headerData: HeaderData;
  isActive: (path: string) => boolean;
  safeLink: (url?: string) => string;
  onOpenSearch: () => void;
}

export default function MobileMenu({ isOpen, onClose, headerData, isActive, safeLink, onOpenSearch }: MobileMenuProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { megaMenu } = headerData;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Menu */}
      <div className="relative w-[85%] max-w-sm bg-white shadow-2xl animate-slide-in-left flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image 
                src={headerData.logo || "https://tamnhuagiada.com/wp-content/uploads/2024/11/logo-1374-hinh.png"} 
                alt="Logo" 
                width={96} // tương đương w-24
                height={30}
                className="h-auto"
            />
            </Link>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <button 
            onClick={() => { onClose(); onOpenSearch(); }} 
            className="w-full flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 text-sm font-medium mb-6 transition-colors border border-slate-100"
          >
            <Search size={18} /> <span>Tìm kiếm sản phẩm...</span>
          </button>
          
          <nav className="space-y-1">
            <Link 
              href="/" 
              className={`flex items-center justify-between p-3.5 rounded-xl transition-all ${isActive('/') ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 font-medium hover:bg-slate-50'}`} 
              onClick={onClose}
            >
              Trang Chủ
            </Link>

            {/* Sản Phẩm Accordion */}
            <div className="rounded-xl overflow-hidden bg-white">
              <button 
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`w-full flex items-center justify-between p-3.5 transition-all ${isProductsOpen ? 'text-brand-600 font-bold' : 'text-slate-700 font-medium hover:bg-slate-50'}`}
              >
                Sản Phẩm
                <ChevronDown size={18} className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'}`} />
              </button>

              <div className={`transition-all duration-300 ease-in-out ${isProductsOpen ? 'max-h-[1000px] opacity-100 pb-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="pl-4 pr-2 space-y-4">
                  {[megaMenu.col1, megaMenu.col2].map((group, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest my-2">
                        {group?.title || (idx === 0 ? "Vật Liệu" : "Phụ Kiện")}
                      </p>
                      {group?.items?.map((item) => {
                        const DynamicIcon = IconMap[item.icon] || IconMap['Box'];
                        return (
                          <Link 
                            key={item.title} 
                            href={`/c/${item.slug}`} 
                            onClick={onClose} 
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                              <DynamicIcon size={16} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{item.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                  
                  {megaMenu.quickLinks && megaMenu.quickLinks.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      {megaMenu.quickLinks.map((ql, idx) => (
                        <Link 
                          key={`ql-${idx}`} 
                          href={safeLink(ql.link)} 
                          onClick={onClose} 
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-sm font-bold text-slate-700">{ql.title}</span>
                          <ChevronRight size={14} className="text-slate-300" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Các menu tĩnh khác */}
            {headerData.navItems && headerData.navItems.length > 0 ? (
              headerData.navItems.map((link) => (
                <Link 
                  key={link.link} 
                  href={safeLink(link.link)} 
                  className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${isActive(safeLink(link.link)) ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 font-medium hover:bg-slate-50'}`} 
                  onClick={onClose}
                >
                  <span className="text-sm">{link.title}</span>
                </Link>
              ))
            ) : (
              ['Ứng Dụng', 'Báo Giá', 'Dự Án', 'Tin Tức', 'Liên Hệ'].map((name) => {
                const path = `/${name === 'Tin Tức' ? 'blog' : name === 'Báo Giá' ? 'pricing' : name === 'Ứng Dụng' ? 'applications' : name === 'Dự Án' ? 'projects' : 'contact'}`;
                return (
                  <Link 
                    key={path} 
                    href={path} 
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${isActive(path) ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 font-medium hover:bg-slate-50'}`} 
                    onClick={onClose}
                  >
                    <span className="text-sm">{name}</span>
                  </Link>
                )
              })
            )}
          </nav>
        </div>
        
        {/* Footer CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <Link href="/pricing" onClick={onClose}>
            <Button fullWidth className="h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20 flex justify-center items-center gap-2">
              Nhận Báo Giá Ngay <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}