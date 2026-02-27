'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, Instagram, Youtube, 
  Truck, ShieldCheck, Headphones, CreditCard, 
  MapPin, Phone, Mail 
} from 'lucide-react';

export const Footer: React.FC = () => (
  // Sử dụng màu nền xanh navy đậm (#0B1727) đặc trưng của doanh nghiệp
  <footer className="bg-[#0B1727] text-slate-300 font-sans border-t-4 border-blue-600">
    
    {/* Section 1: Trust Badges - Nền sáng hơn một chút để tạo sự phân cách */}
    <div className="bg-[#112136] border-b border-[#1C2E45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center gap-4">
            <div className="text-blue-400">
              <Truck size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Giao hàng toàn quốc</h4>
              <p className="text-slate-400 text-xs mt-0.5">Hỗ trợ vận chuyển tận nơi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-blue-400">
              <ShieldCheck size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Bảo hành 15 năm</h4>
              <p className="text-slate-400 text-xs mt-0.5">Cam kết chất lượng vật liệu</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-blue-400">
              <CreditCard size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Thanh toán linh hoạt</h4>
              <p className="text-slate-400 text-xs mt-0.5">Đa dạng phương thức</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-blue-400">
              <Headphones size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Hỗ trợ 24/7</h4>
              <p className="text-slate-400 text-xs mt-0.5">Tư vấn kỹ thuật thi công</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Section 2: Main Navigation Links */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        
        {/* Cột 1: Thông tin liên hệ (Chiếm 4 cột) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic text-lg">N</div>
            <span className="text-2xl font-black text-white tracking-tight">ĐẠI NAM WALL</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
            Tổng kho phân phối vật liệu ốp tường cao cấp. Mang đến giải pháp trang trí nội ngoại thất hiện đại, bền bỉ và tối ưu chi phí.
          </p>
          <ul className="space-y-3 text-sm mt-4">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">123 Đ. Nguyễn Văn Linh, Q. Long Biên, Hà Nội</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-slate-400 shrink-0" />
              <span className="text-white font-bold text-base">0912.345.678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-slate-400 shrink-0" />
              <span className="text-slate-300 hover:text-white transition-colors cursor-pointer">sale@dainamwall.com</span>
            </li>
          </ul>
        </div>

        {/* Cột 2: Danh mục mua sắm (Chiếm 3 cột) */}
        <div className="lg:col-span-3 lg:col-start-6">
          <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-wider">Danh mục mua sắm</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/shop?cat=lam-song" className="text-slate-400 hover:text-white hover:underline underline-offset-4 flex items-center gap-2 w-fit">
                Tấm ốp Lam Sóng <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">HOT</span>
              </Link>
            </li>
            <li><Link href="/shop?cat=nano" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">Tấm ốp Nano</Link></li>
            <li><Link href="/shop?cat=pvc" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">PVC Vân Đá</Link></li>
            <li>
              <Link href="/shop?cat=san-go" className="text-slate-400 hover:text-white hover:underline underline-offset-4 flex items-center gap-2 w-fit">
                Sàn Gỗ Nhựa <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">MỚI</span>
              </Link>
            </li>
            <li><Link href="/shop?cat=phu-kien" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">Phụ Kiện Thi Công</Link></li>
          </ul>
        </div>

        {/* Cột 3: Chăm sóc khách hàng (Chiếm 2 cột) */}
        <div className="lg:col-span-2">
          <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-wider">Hỗ trợ dịch vụ</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">Tra cứu đơn hàng</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">Chính sách đổi trả</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">Chính sách bảo hành</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">Phương thức thanh toán</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-white hover:underline underline-offset-4 block w-fit">Hướng dẫn mua sắm</Link></li>
          </ul>
        </div>

        {/* Cột 4: Mạng xã hội & Thanh toán (Chiếm 3 cột) */}
        <div className="lg:col-span-3">
          <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-wider">Kết nối với chúng tôi</h4>
          <div className="flex gap-3 mb-8">
            <a href="#" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white transition-colors"><Facebook size={18} /></a>
            <a href="#" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#E4405F] hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 rounded bg-[#1C2E45] flex items-center justify-center text-slate-300 hover:bg-[#FF0000] hover:text-white transition-colors"><Youtube size={18} /></a>
          </div>
          
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Thanh toán an toàn</h4>
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
        <p>&copy; {new Date().getFullYear()} Công ty TNHH Đại Nam Wall. GPĐKKD số 0123456789 do Sở KH&ĐT TP. Hà Nội cấp.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
          <span className="text-[#1C2E45]">|</span>
          <Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
        </div>
      </div>
    </div>
    
  </footer>
);