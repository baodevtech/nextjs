'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-brand-600">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center text-white font-serif font-bold italic">N</div>
            <span className="text-xl font-bold text-white tracking-tight">ĐẠI NAM WALL</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          Tiên phong trong lĩnh vực vật liệu ốp tường thế hệ mới. Chúng tôi cam kết mang đến vẻ đẹp sang trọng và độ bền vượt trội cho ngôi nhà của bạn.
        </p>
        <div className="flex gap-4 pt-2">
           <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition-colors"><Facebook size={16} /></a>
           <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition-colors"><Instagram size={16} /></a>
           <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition-colors"><Youtube size={16} /></a>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm border-l-2 border-brand-500 pl-3">Sản Phẩm</h4>
        <ul className="space-y-3 text-sm">
          <li><Link href="/shop?cat=lam-song" className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>Tấm ốp Lam Sóng</Link></li>
          <li><Link href="/shop?cat=nano" className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>Tấm ốp Nano</Link></li>
          <li><Link href="/shop?cat=pvc-stone" className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>PVC Vân Đá</Link></li>
          <li><Link href="/shop?cat=accessories" className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>Phụ Kiện Thi Công</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm border-l-2 border-brand-500 pl-3">Hỗ Trợ Khách Hàng</h4>
        <ul className="space-y-3 text-sm">
          <li><Link href="#" className="hover:text-brand-400 transition-colors">Chính sách bảo hành 15 năm</Link></li>
          <li><Link href="#" className="hover:text-brand-400 transition-colors">Vận chuyển & Thanh toán</Link></li>
          <li><Link href="#" className="hover:text-brand-400 transition-colors">Hướng dẫn thi công</Link></li>
          <li><Link href="#" className="hover:text-brand-400 transition-colors">Câu hỏi thường gặp</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm border-l-2 border-brand-500 pl-3">Liên Hệ</h4>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
             <MapPin className="text-brand-500 shrink-0 mt-1" size={18} />
             <span>123 Đường Nguyễn Văn Linh, Quận Long Biên, Hà Nội</span>
          </li>
          <li className="flex items-center gap-3">
             <Phone className="text-brand-500 shrink-0" size={18} />
             <span className="font-bold text-white">0912.345.678</span>
          </li>
          <li className="flex items-center gap-3">
             <Mail className="text-brand-500 shrink-0" size={18} />
             <span>sale@dainamwall.com</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div className="border-t border-slate-800 pt-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; 2024 Đại Nam Wall. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
           <a href="#" className="hover:text-brand-400">Điều khoản sử dụng</a>
           <a href="#" className="hover:text-brand-400">Chính sách bảo mật</a>
        </div>
      </div>
    </div>
  </footer>
);