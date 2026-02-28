// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { 
  Facebook, Instagram, Youtube, 
  Truck, ShieldCheck, Headphones, CreditCard, 
  MapPin, Phone, Mail, CheckCircle 
} from 'lucide-react';
import { getFooterData } from '@/services/wpService';

const IconMap: Record<string, React.ElementType> = {
  Truck, ShieldCheck, CreditCard, Headphones, CheckCircle
};

// [TỐI ƯU] Hàm bọc an toàn để sửa lỗi dính tiền tố thư mục
const safeLink = (url?: string) => {
  if (!url) return "/";
  if (url.startsWith("http") || url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("#")) return url;
  return url.startsWith("/") ? url : `/${url}`;
};

export async function Footer() {
  const footerData = await getFooterData();
  const { trustBadges, companyInfo, shopCategories, customerService, socialLinks, bottomBar } = footerData;

  return (
    <footer className="bg-[#0B1727] text-slate-300 font-sans border-t-4 border-blue-600">
      
      <div className="bg-[#112136] border-b border-[#1C2E45]">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-5 lg:py-8">
          <div className="grid grid-cols-4 gap-1 sm:gap-4 lg:gap-6 text-sm">
            {trustBadges.map((badge, idx) => {
              const DynamicIcon = IconMap[badge.icon] || CheckCircle;
              return (
                <div key={idx} className="flex flex-col lg:flex-row items-center text-center lg:text-left gap-1.5 lg:gap-4">
                  <div className="text-blue-400 bg-[#1C2E45] lg:bg-transparent w-9 h-9 lg:w-auto lg:h-auto rounded-full flex items-center justify-center">
                    <DynamicIcon className="w-5 h-5 lg:w-9 lg:h-9" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-[10px] sm:text-sm lg:text-base leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5 hidden lg:block">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-6 lg:gap-8">
          
          <div className="col-span-2 lg:col-span-4 space-y-5 lg:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic text-lg shadow-sm">
                {companyInfo.logoText.charAt(0)}
              </div>
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">{companyInfo.logoText}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              {companyInfo.desc}
            </p>
            <ul className="space-y-3.5 text-sm mt-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{companyInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400 shrink-0" />
                <a href={`tel:${companyInfo.phone.replace(/\D/g, '')}`} className="text-white font-bold text-base hover:text-blue-400 transition-colors">
                  {companyInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-slate-400 shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="text-slate-300 hover:text-white transition-colors cursor-pointer break-all">
                  {companyInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3 lg:col-start-6">
            <h4 className="text-white font-bold mb-4 lg:mb-5 uppercase text-[13px] lg:text-sm tracking-wider">{shopCategories.title}</h4>
            <ul className="space-y-3.5 text-sm">
              {shopCategories.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={safeLink(link.url)} className="text-slate-400 hover:text-white hover:underline underline-offset-4 flex flex-wrap items-center gap-2 w-fit py-0.5">
                    {link.title}
                    {link.badge && (
                      <span className={`text-[9px] sm:text-[10px] text-white px-1.5 py-0.5 rounded font-bold leading-none ${link.badgeColor || 'bg-blue-600'}`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-white font-bold mb-4 lg:mb-5 uppercase text-[13px] lg:text-sm tracking-wider">{customerService.title}</h4>
            <ul className="space-y-3.5 text-sm">
              {customerService.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={safeLink(link.url)} className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit py-0.5">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3 pt-2 lg:pt-0 border-t border-[#1C2E45] lg:border-t-0 mt-2 lg:mt-0">
            <h4 className="text-white font-bold mb-4 lg:mb-5 uppercase text-[13px] lg:text-sm tracking-wider pt-4 lg:pt-0">Kết nối</h4>
            <div className="flex gap-3 mb-8">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white transition-colors shadow-sm"><Facebook size={18} /></a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#E4405F] hover:text-white transition-colors shadow-sm"><Instagram size={18} /></a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#FF0000] hover:text-white transition-colors shadow-sm"><Youtube size={18} /></a>
              )}
            </div>
            
            <h4 className="text-white font-bold mb-3 lg:mb-4 uppercase text-[13px] lg:text-sm tracking-wider">Thanh toán an toàn</h4>
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-8 bg-[#1C2E45] rounded border border-[#2A405C] flex items-center justify-center text-[10px] font-bold text-slate-300">VISA</div>
              <div className="w-12 h-8 bg-[#1C2E45] rounded border border-[#2A405C] flex items-center justify-center text-[10px] font-bold text-slate-300">JCB</div>
              <div className="w-12 h-8 bg-[#1C2E45] rounded border border-[#2A405C] flex items-center justify-center text-[10px] font-bold text-slate-300">ATM</div>
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm">COD</div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-[#070F1A] border-t border-[#1C2E45] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4 text-[11px] sm:text-xs text-slate-500 text-center md:text-left">
          <p className="max-w-md lg:max-w-none leading-relaxed">&copy; {new Date().getFullYear()} {bottomBar.copyright}</p>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {bottomBar.links.map((link, idx) => (
              <React.Fragment key={idx}>
                <Link href={safeLink(link.url)} className="hover:text-white transition-colors py-1">{link.title}</Link>
                {idx < bottomBar.links.length - 1 && <span className="text-[#1C2E45] py-1">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
    </footer>
  );
}