'use client';
import React from 'react';
import Link from 'next/link';

export const CTABanner = () => {
  return (
      // 1. SPACING: Giảm cực mạnh xuống py-12 (Mobile), PC giữ py-28 (vừa phải)
      <section className="py-12 md:py-28 bg-slate-950 text-center relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10">
              
              {/* 2. TYPOGRAPHY COMPACT */}
              {/* Heading: Mobile text-3xl (gọn gàng), PC text-6xl */}
              <h2 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-6 tracking-tighter leading-none">
                  Ready to Transform?
              </h2>
              
              {/* Description: Mobile text-sm (nhỏ), PC text-lg */}
              {/* Giảm margin bottom xuống mb-6 */}
              <p className="text-slate-400 text-sm md:text-lg mb-6 md:mb-10 font-light max-w-lg mx-auto leading-relaxed px-2">
                  Liên hệ ngay với chuyên gia Đại Nam Wall để được tư vấn giải pháp tối ưu.
              </p>

              {/* 3. BUTTONS COMPACT */}
              {/* Gap nhỏ (gap-3) */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-5 w-full sm:w-auto px-6 sm:px-0">
                  
                  {/* Primary Button */}
                  <Link href="/contact" className="w-full sm:w-auto">
                      {/* Height h-12 (48px), Text text-xs */}
                      <button className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-full bg-white text-slate-950 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-brand-400 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          Nhận Báo Giá
                      </button>
                  </Link>

                  {/* Secondary Button */}
                  <a 
                    href="tel:0912345678" 
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 flex items-center justify-center rounded-full border border-slate-700 text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-slate-800 hover:border-slate-600 transition-colors"
                  >
                      Hotline: 0912.345.678
                  </a>
              </div>
          </div>
      </section>
  );
};