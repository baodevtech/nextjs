// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { 
  Facebook, Instagram, Youtube, 
  Truck, ShieldCheck, Headphones, CreditCard, 
  MapPin, Phone, Mail, CheckCircle 
} from 'lucide-react';
import { getFooterData } from '@/services/wpService';

// Bộ từ điển Icon cho phần Trust Badges
const IconMap: Record<string, React.ElementType> = {
  Truck, ShieldCheck, CreditCard, Headphones, CheckCircle
};

export async function Footer() {
  // Lấy dữ liệu từ WP (Server-side)
  const footerData = await getFooterData();
  const { trustBadges, companyInfo, shopCategories, customerService, socialLinks, bottomBar } = footerData;

  return (
    <footer className="bg-[#0B1727] text-slate-300 font-sans border-t-4 border-blue-600">
      
      {/* Section 1: Trust Badges */}
      <div className="bg-[#112136] border-b border-[#1C2E45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            {trustBadges.map((badge, idx) => {
              const DynamicIcon = IconMap[badge.icon] || CheckCircle;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="text-blue-400">
                    <DynamicIcon size={36} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">{badge.title}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Main Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Cột 1: Thông tin liên hệ */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic text-lg">
                {companyInfo.logoText.charAt(0)}
              </div>
              <span className="text-2xl font-black text-white tracking-tight">{companyInfo.logoText}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              {companyInfo.desc}
            </p>
            <ul className="space-y-3 text-sm mt-4">
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
                <a href={`mailto:${companyInfo.email}`} className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                  {companyInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 2: Danh mục mua sắm */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-wider">{shopCategories.title}</h4>
            <ul className="space-y-3 text-sm">
              {shopCategories.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url} className="text-slate-400 hover:text-white hover:underline underline-offset-4 flex items-center gap-2 w-fit">
                    {link.title} 
                    {link.badge && (
                      <span className={`text-[10px] text-white px-2 py-0.5 rounded font-bold ${link.badgeColor || 'bg-blue-600'}`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Chăm sóc khách hàng */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-wider">{customerService.title}</h4>
            <ul className="space-y-3 text-sm">
              {customerService.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url} className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Mạng xã hội & Thanh toán */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-wider">Kết nối với chúng tôi</h4>
            <div className="flex gap-3 mb-8">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white transition-colors"><Facebook size={18} /></a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#E4405F] hover:text-white transition-colors"><Instagram size={18} /></a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#FF0000] hover:text-white transition-colors"><Youtube size={18} /></a>
              )}
            </div>
            
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Thanh toán an toàn</h4>
            {/* Giữ nguyên các badge thanh toán vì nó là tiêu chuẩn chung */}
            <div className="flex gap-2">
              <div className="w-12 h-8 bg-[#1C2E45] rounded border border-[#2A405C] flex items-center justify-center text-[10px] font-bold text-slate-300">VISA</div>
              <div className="w-12 h-8 bg-[#1C2E45] rounded border border-[#2A405C] flex items-center justify-center text-[10px] font-bold text-slate-300">JCB</div>
              <div className="w-12 h-8 bg-[#1C2E45] rounded border border-[#2A405C] flex items-center justify-center text-[10px] font-bold text-slate-300">ATM</div>
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white">COD</div>
            </div>
          </div>

        </div>
      </div>

      {/* Section 3: Legal & Copyright */}
      <div className="bg-[#070F1A] border-t border-[#1C2E45] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {bottomBar.copyright}</p>
          <div className="flex gap-4">
            {bottomBar.links.map((link, idx) => (
              <React.Fragment key={idx}>
                <Link href={link.url} className="hover:text-white transition-colors">{link.title}</Link>
                {idx < bottomBar.links.length - 1 && <span className="text-[#1C2E45]">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
    </footer>
  );
}